import { Response, NextFunction } from 'express';

import { BaseErrors, ApplicationErrors } from '../../../common/errors';

/**
 * Handles common error to HTTP Response mapping.
 */
export const commonErrorHandler = (
    err: BaseErrors.BaseError, 
    res: Response, 
    next: NextFunction
): Response | void  => {
    switch (err.constructor) {
        case ApplicationErrors.UnexpectedError:
            return res.status(500).send(err.serializeError());
        default:
            return next(err);
    }
}