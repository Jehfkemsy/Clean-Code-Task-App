/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mock, when, instance, verify, anything, anyString, deepEqual, reset } from 'ts-mockito';

// Authentication
import { IAuthenticationService } from './../../../../../src/features/auth/services/AuthenticationService';
import { ITokenPayload } from './../../../../../src/features/auth/services/AuthenticationService';
import { AuthenticationErrors } from './../../../../../src/features/auth/errors';

// Repository & UoW
import { IUserRepository } from './../../../../../src/features/users/repositories/UserRepository';
import { IUnitOfWorkFactory } from './../../../../../src/common/unit-of-work/unit-of-work';
import { IUnitOfWork } from './../../../../../src/common/unit-of-work/unit-of-work';

// Service & Service DTOs
import UserService from './../../../../../src/features/users/services/UserService';
import { CreateUserDTO } from '../../../../../src/features/users/dtos';
import { UpdateUserDTO, UserCredentialsDTO } from './../../../../../src/features/users/dtos/index';

// Errors
import { CommonErrors, ApplicationErrors } from '../../../../../src/common/errors';
import { CreateUserErrors } from '../../../../../src/features/users/errors';
import { User } from './../../../../../src/features/users/models/domain/user';

// Utils
import * as _ from 'lodash';

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

describe('UserService.getUserById()', () => {
    describe('with a user that can not be found', () => {
        test('should reject with a NotFoundError', async () => {
            expect.assertions(1);

            // Arrange
            const id = '123';
            when(mockUserRepo.getUserById(id)).thenReject(CommonErrors.NotFoundError.create());

            // Act, Assert
            await expect(userService.getUserById(id))
                .rejects
                .toBeInstanceOf(CommonErrors.NotFoundError);
        });        
    });

    describe('with a user that can be found', () => {
        test('should resolve with a user DTO in the correct shape', async () => {
            // Arrange
            const id = '123';
            const user: User = {
                id,
                firstName: 'John',
                lastName: 'Doe',
                username: 'JohnD',
                email: 'John@live.com',
                biography: 'Lorem ipsum',
                password: 'hashed'
            }
            when(mockUserRepo.getUserById(id)).thenResolve(user);

            // Act
            const responseDTO = await userService.getUserById(id);

            // Assert
            expect(responseDTO).toEqual({
                user: _.omit(user, 'password')
            });
        });
    });    
});

describe('UserService.updateUserById()', () => {
    describe('with a malformed update DTO', () => {
        test('should reject with a ValidationError', async () => {
            expect.assertions(1);

            // Arrange
            const updates: UpdateUserDTO = { email: 'jj.com' };

            // Act, Assert
            await expect(userService.updateUserById('123', updates))
                .rejects
                .toBeInstanceOf(CommonErrors.ValidationError);
        });
    });

    describe('with duplicate account update data', () => {
        test('should reject with a UsernameTakenError', async () => {
            expect.assertions(1);

            // Arrange
            const updates: UpdateUserDTO = { username: 'someDuplicate' };
            when(mockUserRepo.existsByEmail(anyString())).thenResolve(false);
            when(mockUserRepo.existsByUsername(updates.username!)).thenResolve(true);

            // Act, Assert
            await expect(userService.updateUserById('123', updates))
                .rejects
                .toBeInstanceOf(CreateUserErrors.UsernameTakenError);
        });

        test('should reject with an EmailTakenError', async () => {
            expect.assertions(1);

            // Arrange
            const updates: UpdateUserDTO = { email: 'duplicate@live.com' };
            when(mockUserRepo.existsByEmail(updates.email!)).thenResolve(true);
            when(mockUserRepo.existsByUsername(anyString())).thenResolve(false);

            // Act, Assert
            await expect(userService.updateUserById('123', updates))
                .rejects
                .toBeInstanceOf(CreateUserErrors.EmailTakenError);
        });     
    });

    describe('with a user that can not be found by the provided id', () => {
        test('should reject with a NotFoundError', async () => {
            expect.assertions(1);

            // Arrange
            const updates: UpdateUserDTO = { email: 'new@live.com' };
            when(mockUserRepo.existsByEmail(anyString())).thenResolve(false);
            when(mockUserRepo.existsByUsername(anyString())).thenResolve(false);
            when(mockUserRepo.getUserById(anyString())).thenReject(CommonErrors.NotFoundError.create());

            // Act, Assert
            await expect(userService.updateUserById('123', updates))
                .rejects
                .toBeInstanceOf(CommonErrors.NotFoundError);
        });
    });

    describe('with valid updates and no external errors', () => {
        test('should call the repository correctly', async () => {
            // Arrange
            const updates: UpdateUserDTO = { email: 'new@live.com' };
            const userResponse: User = {
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                username: 'JDoe',
                email: 'old@live.com',
                biography: 'Lorem ipsum',
                password: 'hash' 
            };
            when(mockUserRepo.existsByEmail(anyString())).thenResolve(false);
            when(mockUserRepo.existsByUsername(anyString())).thenResolve(false);
            when(mockUserRepo.getUserById(anyString())).thenResolve(userResponse);

            // Act
            await userService.updateUserById('123', updates);

            // Assert
            verify(mockUserRepo.updateUser(deepEqual({
                ...userResponse,
                ...updates
            }))).once();
        });       
    });   
});

describe('UserService.deleteUserById()', () => {
    describe('with no issues', () => {
        test('should create a UoW and call the repository correctly', async () => {
            // Arrange
            const userID = '132';
            const mockUnitOfWork: IUnitOfWork = {
                commit: jest.fn().mockResolvedValue(null),
                rollback: jest.fn().mockResolvedValue(null)
            }
            when(mockUoWFactory.create()).thenResolve(mockUnitOfWork);
            when(mockUserRepo.forUnitOfWork(deepEqual(mockUnitOfWork))).thenReturn(instance(mockUserRepo));
            when(mockUserRepo.removeUserById(userID)).thenResolve();
    
            // Act
            await userService.deleteUserById(userID);
    
            // Assert
            verify(mockUserRepo.removeUserById(anyString())).once();
            expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
        });
    });    
});



