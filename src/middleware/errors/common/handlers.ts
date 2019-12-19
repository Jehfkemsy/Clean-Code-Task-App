import { Response, NextFunction } from 'express';

import { BaseErrors, CommonErrors } from '../../../common/errors';

/**
 * Handles common error to HTTP Response mapping.
 */
export const commonErrorHandler = (err: BaseErrors.BaseError, res: Response, next: NextFunction): Response | void  => {
    switch (err.constructor) {
        case CommonErrors.ValidationError:
            return res.status(400).send(err.serializeError());
        default:
            return next();
    }
}