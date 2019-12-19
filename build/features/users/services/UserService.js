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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const user_1 = require("./../models/domain/user");
const domainDtoMapper_1 = require("../mappers/domain-dto/domainDtoMapper");
const user_validation_1 = require("../validation/user-validation");
const index_1 = require("./../../../utils/wrappers/validation/joi/index");
const errors_1 = require("../errors");
const errors_2 = require("../../auth/errors");
const events_2 = require("../pub-sub/events/events");
const errors_3 = require("../../../common/errors");
/**
 * Contains methods that encapsulate primary user-related business logic.
 */
class UserService extends events_1.EventEmitter {
    constructor(userRepository, authenticationService, knexUnitOfWorkFactory) {
        super();
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.knexUnitOfWorkFactory = knexUnitOfWorkFactory;
    }
    // Note order - attempting to fail fast to save network calls.
    signUpUser(userDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = index_1.validate(user_validation_1.UserValidators.createUser, userDTO);
            if (validationResult.isLeft())
                throw errors_3.CommonErrors.ValidationError.create(validationResult.value);
            const [usernameTaken, emailTaken] = yield Promise.all([
                this.userRepository.existsByUsername(userDTO.username),
                this.userRepository.existsByEmail(userDTO.email)
            ]);
            if (usernameTaken)
                throw errors_1.CreateUserErrors.UsernameTakenError.create();
            if (emailTaken)
                throw errors_1.CreateUserErrors.EmailTakenError.create();
            const hash = yield this.authenticationService.hashPassword(userDTO.password);
            const user = user_1.buildUser(Object.assign(Object.assign({}, userDTO), { password: hash }));
            yield this.userRepository.insertUser(user);
            this.emit(events_2.userEvents.userSignedUp, {
                id: user.id,
                email: user.email,
                firstName: user.firstName
            });
        });
    }
    loginUser(credentialsDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = index_1.validate(user_validation_1.UserValidators.userCredentials, credentialsDTO);
            if (validationResult.isLeft())
                throw errors_3.CommonErrors.ValidationError.create(validationResult.value);
            const { email, password } = credentialsDTO;
            try {
                // This throws if no user is found by the specified email.
                const user = yield this.userRepository.findUserByEmail(email);
                const isAuthorized = yield this.authenticationService.comparePasswords(password, user.password);
                if (!isAuthorized)
                    throw errors_2.AuthenticationErrors.AuthorizationError.create();
                const token = this.authenticationService.generateAuthToken({ id: user.id });
                this.emit(events_2.userEvents.userLoggedIn, { id: user.id });
                return { token };
            }
            catch (e) {
                // TODO: Support user failing to log in.
                // TODO: Refactor this switch statement.
                switch (e.constructor) {
                    case errors_2.AuthenticationErrors.AuthorizationError:
                        throw e;
                    default:
                        throw e;
                }
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(id);
            return domainDtoMapper_1.mappers.toUserResponseDTO(user);
        });
    }
    updateUserById(id, updateUserDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = index_1.validate(user_validation_1.UserValidators.updateUser, updateUserDTO);
            if (validationResult.isLeft())
                throw errors_3.CommonErrors.ValidationError.create(validationResult.value);
            if (updateUserDTO.email) {
                const emailTaken = this.userRepository.existsByEmail(updateUserDTO.email);
                if (emailTaken)
                    throw errors_1.CreateUserErrors.EmailTakenError.create();
            }
            if (updateUserDTO.username) {
                const usernameTaken = this.userRepository.existsByUsername(updateUserDTO.username);
                if (usernameTaken)
                    throw errors_1.CreateUserErrors.UsernameTakenError.create();
            }
            const user = yield this.userRepository.getUserById(id);
            const updatedUser = user_1.buildUser(Object.assign(Object.assign(Object.assign({}, (() => { const { id } = user, rest = __rest(user, ["id"]); return rest; })()), updateUserDTO), { password: user.password // <-- Just to be safe, ensure the password is never updated.
             }), id);
            yield this.userRepository.updateUser(updatedUser);
            this.emit(events_2.userEvents.userUpdated, { id: user.id, passwordUpdated: false });
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unitOfWork = yield this.knexUnitOfWorkFactory.create();
            const boundUserRepository = this.userRepository.forUnitOfWork(unitOfWork);
            yield boundUserRepository.removeUserById(id);
        });
    }
}
exports.default = UserService;
