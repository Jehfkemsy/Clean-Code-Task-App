import { Response, NextFunction } from 'express';

import { BaseErrors } from '../../../common/errors';

import { ErrorHandlerFunction } from './../errorHandlerProvider';
import { AuthenticationErrors } from '../../../features/auth/errors';


/**
 * Handles user error to HTTP Response mapping.
 */
export const authErrorHandler: ErrorHandlerFunction = (err: BaseErrors.BaseError, res: Response, next: NextFunction): Response | void  => {
    switch (err.constructor) {
        case AuthenticationErrors.InvalidTokenError:
        case AuthenticationErrors.AuthorizationError:
            return res.status(401).send(err.serializeError());
        default:
            return next();
    }
};