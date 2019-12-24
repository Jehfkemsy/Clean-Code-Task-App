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
import { CommonErrors, ApplicationErrors } from '../../../common/errors';

import { IUnitOfWorkFactory } from '../../../common/unit-of-work/unit-of-work';

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
export default class UserService extends EventEmitter implements IUserService {
    public constructor (
        private readonly userRepository: IUserRepository,
        private readonly authenticationService: IAuthenticationService,
        private readonly knexUnitOfWorkFactory: IUnitOfWorkFactory
    ) {
        super();
    }

    // Note order - attempting to fail fast to save network calls.
    async signUpUser(userDTO: CreateUserDTO): Promise<void> {
        const validationResult = validate(UserValidators.createUser, userDTO);

        if (validationResult.isLeft()) 
            return Promise.reject(CommonErrors.ValidationError.create(validationResult.value));

        const [usernameTaken, emailTaken] = await Promise.all([
            this.userRepository.existsByUsername(userDTO.username),
            this.userRepository.existsByEmail(userDTO.email)
        ]) as [boolean, boolean];

        if (usernameTaken)
            return Promise.reject(CreateUserErrors.UsernameTakenError.create());
    
        if (emailTaken)
            return Promise.reject(CreateUserErrors.EmailTakenError.create());

        const hash = await this.authenticationService.hashPassword(userDTO.password);

        const user: User = buildUser({ ...userDTO, password: hash })

        await this.userRepository.insertUser({ ...user, id: 'data' });

        this.emit(userEvents.userSignedUp, { 
            id: user.id,
            email: user.email,
            firstName: user.firstName
        });
    }    
    
    async loginUser(credentialsDTO: UserCredentialsDTO): Promise<LoggedInUserResponseDTO> {
        const validationResult = validate(UserValidators.userCredentials, credentialsDTO);

        if (validationResult.isLeft())
            return Promise.reject(CommonErrors.ValidationError.create(validationResult.value));

        const { email, password } = credentialsDTO;

        try {
            // This throws if no user is found by the specified email. 
            // Saves an extra network call than using existsByEmail: Promise<boolean>; and then this.
            const user = await this.userRepository.findUserByEmail(email);
            const isAuthorized = await this.authenticationService.comparePasswords(password, user.password);

            if (!isAuthorized) return Promise.reject(AuthenticationErrors.AuthorizationError.create());

            const token = this.authenticationService.generateAuthToken({ id: user.id });

            this.emit(userEvents.userLoggedIn, { id: user.id });

            return { token };
        } catch (e) {
            // TODO: Support user failing to log in.

            // TODO: Refactor this switch statement.
            switch (e.constructor) {
                case AuthenticationErrors.AuthorizationError:
                case CommonErrors.NotFoundError:
                    return Promise.reject(AuthenticationErrors.AuthorizationError.create());
                default:
                    return Promise.reject(ApplicationErrors.UnexpectedError.create());
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
            return Promise.reject(CommonErrors.ValidationError.create(validationResult.value));

        if (updateUserDTO.email) {
            const emailTaken = await this.userRepository.existsByEmail(updateUserDTO.email);
            if (emailTaken) return Promise.reject(CreateUserErrors.EmailTakenError.create());
        }

        if (updateUserDTO.username) {
            const usernameTaken = await this.userRepository.existsByUsername(updateUserDTO.username);
            if (usernameTaken) return Promise.reject(CreateUserErrors.UsernameTakenError.create());
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
        const unitOfWork = await this.knexUnitOfWorkFactory.create();
        const boundUserRepository = this.userRepository.forUnitOfWork(unitOfWork);

        await boundUserRepository.removeUserById(id);

        await unitOfWork.commit();
    }
}