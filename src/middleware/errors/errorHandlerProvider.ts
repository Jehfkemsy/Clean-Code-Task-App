import { Request, Response, NextFunction } from 'express';
import { BaseErrors } from '../../common/errors';

export type ErrorHandlerFunction = (err: BaseErrors.BaseError, res: Response, next: NextFunction) => Response | void;

export const errorHandlerProvider = (
    handlerFunc: ErrorHandlerFunction
) => (err: Error, req: Request, res: Response, next: NextFunction): Response | void => {
    if (err instanceof BaseErrors.BaseError && err.customError) {
        return handlerFunc(err, res, next);
    } else {
        return next();
    }
}