import { BaseErrors } from '../../../common/errors';

export namespace AuthenticationErrors {
    export class InvalidTokenError extends BaseErrors.BaseError {

    }

    export class AuthorizationError extends BaseErrors.BaseError {
        
    }
}