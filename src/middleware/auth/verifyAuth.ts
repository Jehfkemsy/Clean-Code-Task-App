import { Request, Response, NextFunction } from 'express';

import { IAuthenticationService } from './../../features/auth/services/AuthenticationService';
import { IUserRepository } from './../../features/users/repositories/UserRepository';

import { AuthenticationErrors } from '../../features/auth/errors';
import { CommonErrors } from '../../common/errors';

/**
 * Provides a `verifyAuth` middleware function that ensures a provided Bearer Token is valid.
 */
export const verifyAuthProvider = (
    authenticationService: IAuthenticationService, 
    userRepository: IUserRepository
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('in provider')
    try {
        if (!req.token) throw AuthenticationErrors.AuthorizationError.create();
        
        const decodedResult = authenticationService.verifyAndDecodeAuthToken(req.token);
        console.log('decoded')

        if (decodedResult.isLeft())
            throw decodedResult.value;

        const user = await userRepository.getUserById(decodedResult.value.id);

        console.log('found by id')

        // Add user to DIC and Request here.
        req.user = user;

        next();
    } catch (e) {
        switch (e.constructor) {
            // Fall through. Cool.
            case CommonErrors.NotFoundError:
            case AuthenticationErrors.InvalidTokenError:
            case AuthenticationErrors.AuthorizationError:
                throw AuthenticationErrors.AuthorizationError.create();
            default:
                throw new Error();
        }
    }
}