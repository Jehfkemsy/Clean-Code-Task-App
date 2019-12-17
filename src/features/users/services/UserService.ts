import { EventEmitter } from 'events';

import { User, buildUser } from './../models/domain/user';

import { IUserRepository } from './../repositories/UserRepository';
import { IAuthenticationService } from './../../auth/services/AuthenticationService';

import { 
    CreateUserDTO, 
    UserCredentialsDTO, 
    UserResponseDTO,
    LoggedInUserResponseDTO,
    UpdateUserDTO
} from './../dtos';

import { mappers } from '../mappers/domain-dto/domainDtoMapper';

import { UserValidators } from '../validation/user-validation';
import { validate } from './../../../utils/wrappers/validation/joi/index';

import { CreateUserErrors } from '../errors';
import { AuthenticationErrors } from '../../auth/errors';

import { userEvents } from '../pub-sub/events/events';

/**
 * Interface providing methods for use with business logic-related operations.
 */
export interface IUserService {
    signUpUser(userDTO: CreateUserDTO): Promise<void>;
    loginUser(credentialsDTO: UserCredentialsDTO): Promise<LoggedInUserResponseDTO>;
    getUserById(id: string): Promise<UserResponseDTO>;
    updateUserById(id: string, updateUserDTO: UpdateUserDTO): Promise<void>;
    deleteUserById(id: string): Promise<void>;
}

/**
 * Contains methods that encapsulate primary user-related business logic.
 */
export class UserService extends EventEmitter implements IUserService {
    public constructor (
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthenticationService
    ) {
        super();
    }

    // Note order - attempting to fail fast to save network calls.
    async signUpUser(userDTO: CreateUserDTO): Promise<void> {
        const validationResult = validate(UserValidators.createUser, userDTO);

        if (validationResult.isLeft())
            throw new Error(validationResult.value);

        const [usernameTaken, emailTaken] = await Promise.all([
            this.userRepository.existsByUsername(userDTO.username),
            this.userRepository.existsByEmail(userDTO.email)
        ]) as [boolean, boolean];

        if (usernameTaken)
            throw new CreateUserErrors.UsernameTakenError();
    
        if (emailTaken)
            throw new CreateUserErrors.EmailTakenError();

        const hash = await this.authService.hashPassword(userDTO.password);

        const user: User = buildUser({ ...userDTO, password: hash })

        await this.userRepository.insertUser(user);

        this.emit(userEvents.userSignedUp, { 
            id: user.id,
            email: user.email,
            firstName: user.firstName
        });
    }    
    
    async loginUser(credentialsDTO: UserCredentialsDTO): Promise<LoggedInUserResponseDTO> {
        const validationResult = validate(UserValidators.userCredentials, credentialsDTO);

        if (validationResult.isLeft())
            throw new Error(validationResult.value);

        const { email, password } = credentialsDTO;

        try {
            // This throws if no user is found by the specified email.
            const user = await this.userRepository.findUserByEmail(email);
            const isAuthorized = await this.authService.comparePasswords(password, user.password);

            if (!isAuthorized) throw new AuthenticationErrors.AuthorizationError();

            const token = this.authService.generateAuthToken({ id: user.id });

            this.emit(userEvents.userLoggedIn, { id: user.id });

            return { token };
        } catch (e) {
            // TODO: Support user failing to log in.

            // TODO: Refactor this switch statement.
            switch (e.constructor) {
                case AuthenticationErrors.AuthorizationError:
                    throw e;
                default:
                    throw e;
            }
        }
    }

    async getUserById(id: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.getUserById(id);
        return mappers.toUserResponseDTO(user);
    }

    async updateUserById(id: string, updateUserDTO: UpdateUserDTO): Promise<void> {
        const validationResult = validate(UserValidators.updateUser, updateUserDTO);

        if (validationResult.isLeft())
            throw new Error(validationResult.value);

        if (updateUserDTO.email) {
            const emailTaken = this.userRepository.existsByEmail(updateUserDTO.email);
            if (emailTaken) throw new CreateUserErrors.EmailTakenError();
        }

        if (updateUserDTO.username) {
            const usernameTaken = this.userRepository.existsByUsername(updateUserDTO.username);
            if (usernameTaken) throw new CreateUserErrors.UsernameTakenError();
        }

        const user = await this.userRepository.getUserById(id);

        const updatedUser = buildUser({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ...((): Omit<User, 'id'> => { const { id, ...rest } = user; return rest; })(),
            ...updateUserDTO,
            password: user.password // <-- Just to be safe, ensure the password is never updated.
        }, id);

        await this.userRepository.updateUser(updatedUser);

        this.emit(userEvents.userUpdated, { id: user.id, passwordUpdated: false });
    }

    async deleteUserById(id: string): Promise<void> {
        console.log(id);
        throw new Error("Method not implemented.");
    }
}