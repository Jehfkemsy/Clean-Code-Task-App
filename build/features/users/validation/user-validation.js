"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
/**
 * Common fields for user validation related operations.
 */
const userCommonFields = {
    firstName: joi_1.default.string()
        .min(2)
        .max(20)
        .required(),
    lastName: joi_1.default.string()
        .min(2)
        .max(30)
        .required(),
    username: joi_1.default.string()
        .min(2)
        .max(20)
        .required(),
    biography: joi_1.default.string()
        .min(2)
        .max(350)
        .required(),
    email: joi_1.default.string()
        .email()
        .required(),
};
var UserValidators;
(function (UserValidators) {
    UserValidators.createUser = joi_1.default.object().keys(Object.assign(Object.assign({}, userCommonFields), { password: joi_1.default.string()
            .regex(/[A-Z]/, { name: 'Has uppercase letters' })
            .regex(/[a-z]/, { name: 'Has lowercase letters' })
            .regex(/\d/, { name: 'Has numbers' })
            .regex(/\W/, { name: 'Has special characters' })
            .required() }));
    UserValidators.updateUser = joi_1.default.object(userCommonFields)
        .optional();
    UserValidators.user = UserValidators.createUser.keys({
        id: joi_1.default.string().required()
    });
    UserValidators.userCredentials = joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    });
})(UserValidators = exports.UserValidators || (exports.UserValidators = {}));
