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
import { UpdateUserDTO, UserCredentialsDTO } from './../../../../../src/features/users/dtos/index';

// Errors
import { CommonErrors, ApplicationErrors } from '../../../../../src/common/errors';
import { CreateUserErrors } from '../../../../../src/features/users/errors';
import { User } from './../../../../../src/features/users/models/domain/user';

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
    const mockedUserBuilder = (partialUserDTO?: Partial<CreateUserDTO>): CreateUserDTO => ({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john_doe@outlook.com',
        username: 'JohnD',
        biography: 'Lorem ipsum',
        password: 'password123P!@#',
        ...partialUserDTO
    });

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
            when(mockUserRepo.existsByEmail(uniqueEmail)).thenResolve(false);

            const mockUserDTO = mockedUserBuilder({ username: duplicateUsername, email: uniqueEmail });

            // Act, Assert
            await expect(userService.signUpUser(mockUserDTO))   
                .rejects
                .toBeInstanceOf(CreateUserErrors.UsernameTakenError);
        });
    });

    describe('with authentication problems', () => {
        test('should throw a CouldNotHashPasswordError', async () => {
            expect.assertions(1);

            // Arrange
            when(mockAuthService.hashPassword(anything())).thenReject(AuthenticationErrors.CouldNotHashPasswordError.create());
            when(mockUserRepo.existsByUsername(anything())).thenResolve(false);
            when(mockUserRepo.existsByEmail(anything())).thenResolve(false);

            const mockUserDTO = mockedUserBuilder();

            // Act, Assert
            await expect(userService.signUpUser(mockUserDTO))
                .rejects
                .toBeInstanceOf(AuthenticationErrors.CouldNotHashPasswordError);
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

describe('UserService.loginUser()', () => {
    describe('with malformed credentials data', () => {
        test('should reject with ValidationError', async () => {
            expect.assertions(1);

            // Arrange
            const userCredentialsDTO: UserCredentialsDTO = {
                email: 'invalid.com',   // <- [FAILS] No "@" symbol.
                password: 'data'        // <- [FAILS] Password complexity.
            };

            // Act, Assert
            await expect(userService.loginUser(userCredentialsDTO))
                .rejects
                .toBeInstanceOf(CommonErrors.ValidationError);
        });
    });

    describe('with incorrect login information', () => {
        test('should reject with AuthorizationError if user does not exist by email', async () => {
            expect.assertions(1);

            // Arrange
            when(mockUserRepo.findUserByEmail(anyString())).thenReject(CommonErrors.NotFoundError.create());

            // Act, Assert
            await expect(userService.loginUser({ email: 'e@g.com', password: 'pwd123PSD$%' }))
                .rejects
                .toBeInstanceOf(AuthenticationErrors.AuthorizationError)
        });
        
        test('should reject with AuthorizationError if passwords do not match', async () => {
            expect.assertions(1);

            // Arrange
            const candidatePassword = 'wrong-hash';
            const actualPassword = 'correct-hash';

            when(mockAuthService.comparePasswords(candidatePassword, actualPassword)).thenResolve(false);
            when(mockUserRepo.findUserByEmail(anyString())).thenResolve({
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@live.com',
                username: 'JDoe',
                biography: 'Lorem ipsum',
                password: actualPassword
            });

            // Act, Assert
            await expect(userService.loginUser({ email: 'john.doe@live.com', password: candidatePassword }))
                .rejects
                .toBeInstanceOf(AuthenticationErrors.AuthorizationError)
        });
    });

    describe('with AuthenticationService issues', () => {
        test('should reject with UnexpectedError if passwords can not be compared', async () => {
            expect.assertions(1);

            // Arrange
            when(mockAuthService.comparePasswords(anyString(), anyString()))
                .thenReject(AuthenticationErrors.CouldNotCompareHashesError.create());
            when(mockUserRepo.findUserByEmail(anyString())).thenResolve({
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@live.com',
                username: 'JDoe',
                biography: 'Lorem ipsum',
                password: 'password hash'
            });

            // Act, Assert
            await expect(userService.loginUser({ email: 'john.doe@live.com', password: 'pWd123.^&*' }))
                .rejects
                .toBeInstanceOf(ApplicationErrors.UnexpectedError)
        });        
    });

    describe('with correct login information', () => {
        test('should resolve with a token', async () => {
            expect.assertions(1);

            // Arrange
            when(mockAuthService.generateAuthToken(deepEqual({ id: '123' }))).thenReturn('token');
            when(mockAuthService.comparePasswords(anyString(), anyString())).thenResolve(true);
            when(mockUserRepo.findUserByEmail(anyString())).thenResolve({
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@live.com',
                username: 'JDoe',
                biography: 'Lorem ipsum',
                password: 'password hash'
            });

            // Act
            const loggedInResponseDTO = await userService.loginUser({ email: 'john.doe@live.com', password: 'pWd123.^&*' });

            // Assert
            expect(loggedInResponseDTO).toEqual({ token: 'token' });
        });
    }); 
});
