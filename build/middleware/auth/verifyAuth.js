"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../features/auth/errors");
/**
 * Provides a `verifyAuth` middleware function that ensures a provided Bearer Token is valid.
 */
exports.verifyAuthProvider = (authService, userRepository) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.token)
            throw errors_1.AuthenticationErrors.AuthorizationError.create();
        const decodedResult = authService.verifyAndDecodeAuthToken(req.token);
        if (decodedResult.isLeft())
            throw decodedResult.value;
        const user = yield userRepository.getUserById(decodedResult.value.id);
        // Add user to DIC and Request here.
        req.user = user;
        next();
    }
    catch (e) {
        switch (e.constructor) {
            // Fall through. Cool.
            case errors_1.AuthenticationErrors.InvalidTokenError:
            case errors_1.AuthenticationErrors.AuthorizationError:
                throw errors_1.AuthenticationErrors.AuthorizationError.create();
            default:
                throw new Error();
        }
    }
});
