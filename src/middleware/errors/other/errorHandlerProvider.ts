import { Request, Response, NextFunction } from 'express';
import { BaseErrors } from '../../../common/errors';

export type ErrorHandlerFunction = (err: BaseErrors.BaseError, res: Response, next: NextFunction) => Response | void;

/**
 * Injects an `ErrorHandlerFunction` into the scope of an Express Middleware function, providing access to the
 * `Error`, `Request`, `Response`, and `NextFunction` arguments. Checks if the `err` is a custom error, passing it
 * to the handler function if so, calling `next` to drop into the next function of the stack if not.   
 * @param handlerFunc Error Handler Function.
 */
export const errorHandlerProvider = (
    handlerFunc: ErrorHandlerFunction
) => (err: Error, req: Request, res: Response, next: NextFunction): Response | void => {
    if (err instanceof BaseErrors.BaseError && err.customError) {
        return handlerFunc(err, res, next);
    } else {
        return next(err);
    }
}