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
        if (!req.token) throw new AuthenticationErrors.AuthorizationError();
        
        const decodedResult = authService.verifyAndDecodeAuthToken(req.token);

        if (decodedResult.isLeft())
            throw decodedResult.value;

        const user = await userRepository.getUserById(decodedResult.value.id);

        // Add user to DIC and Request here.
        req.user = user;

        next();
    } catch (e) {
        switch (e.constructor) {
            case AuthenticationErrors.InvalidTokenError:
                throw new AuthenticationErrors.AuthorizationError('The provided token is invalid.');
            case AuthenticationErrors.InvalidTokenError:
                throw new AuthenticationErrors.AuthorizationError('Please authenticate.');
            default:
                throw new Error();
        }
    }
}