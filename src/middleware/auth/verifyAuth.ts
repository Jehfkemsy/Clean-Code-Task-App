import { Request, Response, NextFunction } from 'express';

import { IAuthenticationService } from './../../features/auth/services/AuthenticationService';
import { IUserRepository } from './../../features/users/repositories/UserRepository';

import { AuthenticationErrors } from '../../features/auth/errors';

/**
 * Provides a `verifyAuth` middleware function that ensures a provided Bearer Token is valid.
 */
export const verifyAuthProvider = (
    authService: IAuthenticationService, 
    userRepository: IUserRepository
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.token) throw AuthenticationErrors.AuthorizationError.create();
        
        const decodedResult = authService.verifyAndDecodeAuthToken(req.token);

        if (decodedResult.isLeft())
            throw decodedResult.value;

        const user = await userRepository.getUserById(decodedResult.value.id);

        // Add user to DIC and Request here.
        req.user = user;

        next();
    } catch (e) {
        switch (e.constructor) {
            // Fall through. Cool.
            case AuthenticationErrors.InvalidTokenError:
            case AuthenticationErrors.AuthorizationError:
                throw AuthenticationErrors.AuthorizationError.create();
            default:
                throw new Error();
        }
    }
}