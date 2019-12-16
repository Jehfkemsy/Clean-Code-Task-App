import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { Either } from '../../../utils/logic/Either';
import { right, left } from './../../../utils/logic/Either';

import { AuthenticationErrors } from './../errors';

/**
 * Interface providing methods for use with authentication/authorization-related operations.
 */
export interface IAuthenticationService {
    /** Hashes a given password by the given rounds, defaults to 12 rounds if not set. */
    hashPassword(plainTextPassword: string, rounds?: number): Promise<string>;
    comparePasswords(candidate: string, hash: string): Promise<boolean>;
    generateAuthToken(payload: ITokenPayload): string;
    /** Attempts to verify and decode a token, producing an Either Monad result. */
    verifyAndDecodeAuthToken(token: string): Either<Authentication.InvalidTokenError, ITokenPayload>;
}

/**
 * Represents the JWT Payload.
 */
export interface ITokenPayload {
    id: string;
}

/**
 * Handles authentication/authorization-related operations surrounding password
 * hashing, password comparison, auth token generation, and auth token verification.
 */
export class AuthenticationService implements IAuthenticationService {
    public constructor (
        private readonly bcrypt: typeof bcryptjs,
        private readonly jwt: typeof jsonwebtoken
    ) {}

    hashPassword(plainTextPassword: string, rounds: number = 12): Promise<string> {
        return new Promise((resolve, reject) => {
            // Will auto-generate a salt.
            this.bcrypt.hash(plainTextPassword, rounds, (err: Error, hash: string) => {
                if (err) return reject(err);
                return resolve(hash);
            });
        });
    }

    comparePasswords(candidate: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.bcrypt.compare(candidate, hash, (err: Error, res: boolean) => {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }

    generateAuthToken(payload: ITokenPayload): string {
        return this.jwt.sign(payload, <string> process.env.JWT_SECRET);
    }

    verifyAndDecodeAuthToken(token: string): Either<Authentication.InvalidTokenError, ITokenPayload> {
        try {
            return right(<ITokenPayload> this.jwt.verify(token, <string> process.env.JWT_SECRET));
        } catch (e) {
            return left(new Authentication.InvalidTokenError());
        }
    }
}