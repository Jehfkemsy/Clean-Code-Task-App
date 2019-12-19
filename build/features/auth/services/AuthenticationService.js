"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("./../../../utils/logic/Either");
const errors_1 = require("./../errors");
/**
 * Handles authentication/authorization-related operations surrounding password
 * hashing, password comparison, auth token generation, and auth token verification.
 */
class AuthenticationService {
    constructor(bcrypt, jwt) {
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }
    hashPassword(plainTextPassword, rounds = 12) {
        return new Promise((resolve, reject) => {
            // Will auto-generate a salt.
            this.bcrypt.hash(plainTextPassword, rounds, (err, hash) => {
                if (err)
                    return reject(err);
                return resolve(hash);
            });
        });
    }
    comparePasswords(candidate, hash) {
        return new Promise((resolve, reject) => {
            this.bcrypt.compare(candidate, hash, (err, res) => {
                if (err)
                    return reject(err);
                return resolve(res);
            });
        });
    }
    generateAuthToken(payload) {
        return this.jwt.sign(payload, process.env.JWT_SECRET);
    }
    verifyAndDecodeAuthToken(token) {
        try {
            return Either_1.right(this.jwt.verify(token, process.env.JWT_SECRET));
        }
        catch (e) {
            return Either_1.left(errors_1.AuthenticationErrors.InvalidTokenError.create());
        }
    }
}
exports.default = AuthenticationService;
