import { Response, NextFunction } from 'express';

import { BaseErrors } from '../../../common/errors';
import { CreateUserErrors } from '../../../features/users/errors';
import { ErrorHandlerFunction } from '../other/errorHandlerProvider';

/**
 * Handles user error to HTTP Response mapping.
 */
export const userErrorHandler: ErrorHandlerFunction = (
    err: BaseErrors.BaseError, 
    res: Response, 
    next: NextFunction
): Response | void  => {
    switch (err.constructor) {
        case CreateUserErrors.UsernameTakenError:
        case CreateUserErrors.EmailTakenError:
            return res.status(409).send(err.serializeError());
        default:
            return next();
    }
};