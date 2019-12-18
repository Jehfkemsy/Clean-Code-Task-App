import { Request, Response, NextFunction } from 'express';

import { CommonErrors, BaseErrors, ApplicationErrors } from '../../common/errors';
import { CreateUserErrors } from '../../features/users/errors';
import { AuthenticationErrors } from '../../features/auth/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    const sendResponseForBaseError = (code: number, error: BaseErrors.BaseError): Response => 
        res.status(code).send(error.serializeError());

    if (err instanceof BaseErrors.BaseError) {
        switch (err.constructor) {
            // 400 responses.
            case CommonErrors.ValidationError:
            case CreateUserErrors.EmailTakenError:
            case CreateUserErrors.UsernameTakenError:
                return sendResponseForBaseError(400, err);
            // 401 responses.
            case AuthenticationErrors.AuthorizationError:
            case AuthenticationErrors.InvalidTokenError:
                return sendResponseForBaseError(401, err);
            // 500 responses.
            case ApplicationErrors.UnexpectedError:
                return sendResponseForBaseError(500, err);
            default:
                return res.status(500).send({ error: 'An unexpected error occurred.' });
        }
    } else {
        return res.status(500).send({ error: 'An unexpected error occurred.' });
    }
}