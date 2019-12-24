import { mock, when, instance, verify, anything, anyString, deepEqual, reset } from 'ts-mockito';

// Authentication
import { IAuthenticationService } from './../../../../../src/features/auth/services/AuthenticationService';
import { ITokenPayload } from './../../../../../src/features/auth/services/AuthenticationService';
import { AuthenticationErrors } from './../../../../../src/features/auth/errors';

// Repository & UoW
import { IUserRepository } from './../../../../../src/features/users/repositories/UserRepository';
import { IUnitOfWorkFactory } from './../../../../../src/common/unit-of-work/unit-of-work';

// Service & Service DTOs
import UserService from './../../../../../src/features/users/services/UserService';
import { CreateUserDTO } from '../../../../../src/features/users/dtos';
import { UpdateUserDTO } from './../../../../../src/features/users/dtos/index';

// Errors
import { CommonErrors } from '../../../../../src/common/errors';
import { CreateUserErrors } from '../../../../../src/features/users/errors';
import { User } from './../../../../../src/features/users/models/domain/user';

const mockedUserBuilder = (partialUserDTO?: Partial<CreateUserDTO>): CreateUserDTO => ({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john_doe@outlook.com',
    username: 'JohnD',
    biography: 'Lorem ipsum',
    password: 'password123P!@#',
    ...partialUserDTO
});

const mockUserRepo = mock<IUserRepository>();
const mockAuthService = mock<IAuthenticationService>();
const mockUoWFactory = mock<IUnitOfWorkFactory>();

let userService: UserService;

beforeEach(() => {
    reset(mockUserRepo);
    reset(mockAuthService);
    reset(mockUoWFactory);

    userService = new UserService(
        instance(mockUserRepo), 
        instance(mockAuthService), 
        instance(mockUoWFactory)
    );

});

describe('UserService.signUpUser()', () => {
    describe('with bad user data', () => {
        test('should reject with ValidationError', async () => {
            expect.assertions(1);
    
            // Arrange            
            const mockUserDTO = mockedUserBuilder({
                lastName: '',               // <- [FAILS] Minimum length
                email: 'invalid.com',       // <- [FAILS] No "@" symbol.
                password: 'data'            // <- [FAILS] Password complexity.
            });

            // Act, Assert
            await expect(userService.signUpUser(mockUserDTO))
                .rejects
                .toBeInstanceOf(CommonErrors.ValidationError);
        });

        test('should reject with EmailTakenError', async () => {
            expect.assertions(1);

            // Arrange
            const duplicateEmail = 'example@domain.com';
            const uniqueUsername = 'mathIsFun';

            when(mockUserRepo.existsByUsername(uniqueUsername)).thenResolve(false);
            when(mockUserRepo.existsByEmail(duplicateEmail)).thenResolve(true);

            const mockUserDTO = mockedUserBuilder({ username: uniqueUsername, email: duplicateEmail });

            // Act, Assert
            await expect(userService.signUpUser(mockUserDTO))   
                .rejects
                .toBeInstanceOf(CreateUserErrors.EmailTakenError);
        });

        test('should reject with UsernameTakenError', async () => {
            expect.assertions(1);

            // Arrange
            const uniqueEmail = 'example@domain.com';
            const duplicateUsername = 'mathIsFun';

            when(mockUserRepo.existsByUsername(duplicateUsername)).thenResolve(true);
            when(mockUserRepo.existsByEmail(uniqueEmail)).thenResolve(true);

            const mockUserDTO = mockedUserBuilder({ username: duplicateUsername, email: uniqueEmail });

            // Act, Assert
            await expect(userService.signUpUser(mockUserDTO))   
                .rejects
                .toBeInstanceOf(CreateUserErrors.UsernameTakenError);
        });
    });

    describe('with correct user data', () => {
        test('should call the repository correctly', async () => {
            // Arrange
            const password = 'PawwRD123!@#$';
            const hashedPassword = 'hashed';

            when(mockUserRepo.existsByUsername(anything())).thenResolve(false);
            when(mockUserRepo.existsByEmail(anything())).thenResolve(false);
            when(mockUserRepo.insertUser(anything())).thenResolve();
            when(mockAuthService.hashPassword(password)).thenResolve(hashedPassword);

            const mockUserDTO = mockedUserBuilder({ password });

            // Act
            await userService.signUpUser(mockUserDTO);

            // Assert
            const expectedUser: User = {
                id: 'data',
                ...mockUserDTO,
                password: hashedPassword
            }

            verify(mockUserRepo.insertUser(deepEqual(expectedUser))).once();
        });
    });
});