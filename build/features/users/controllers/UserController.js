"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const awilix_express_1 = require("awilix-express");
const celebrate_1 = require("celebrate");
const BaseHTTPController_1 = require("./../../../common/controllers/BaseHTTPController");
const user_validation_1 = require("../validation/user-validation");
const stripBearerToken_1 = require("./../../../middleware/utils/stripBearerToken");
const verifyAuth_1 = require("./../../../middleware/auth/verifyAuth");
const index_1 = require("./../../auth/errors/index");
/**
 * HTTP Client interface/controller gateway to application for handling user-related operations.
 */
let UserController = class UserController extends BaseHTTPController_1.BaseHTTPController {
    constructor(userService, httpContext) {
        super(httpContext);
        this.userService = userService;
    }
    test(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('here');
            return response.status(200).send('hi');
        });
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.signUpUser(request.body);
            return this.createdOk();
        });
    }
    loginUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('here');
            const loggedInResponseDTO = yield this.userService.loginUser(request.body);
            return this.withDTO(loggedInResponseDTO);
        });
    }
    getUserById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserById(request.params.id);
            return this.withDTO(user);
        });
    }
    getMe(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.user)
                throw index_1.AuthenticationErrors.AuthorizationError.create();
            const user = yield this.userService.getUserById(request.user.id);
            return this.withDTO(user);
        });
    }
    updateMe(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.user)
                throw index_1.AuthenticationErrors.AuthorizationError.create();
            yield this.userService.updateUserById(request.user.id, request.body);
            return this.ok();
        });
    }
    deleteMe(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.deleteUserById(request.params.id);
            return this.ok();
        });
    }
};
__decorate([
    awilix_express_1.POST(),
    awilix_express_1.route('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "test", null);
__decorate([
    awilix_express_1.POST(),
    awilix_express_1.before(celebrate_1.celebrate({ body: user_validation_1.UserValidators.createUser })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    awilix_express_1.POST(),
    awilix_express_1.route('/login'),
    awilix_express_1.before(celebrate_1.celebrate({ body: user_validation_1.UserValidators.userCredentials })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    awilix_express_1.GET(),
    awilix_express_1.route('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    awilix_express_1.GET(),
    awilix_express_1.route('/me'),
    awilix_express_1.before([stripBearerToken_1.stripBearerToken, awilix_express_1.inject(verifyAuth_1.verifyAuthProvider)]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    awilix_express_1.PATCH(),
    awilix_express_1.route('/me'),
    awilix_express_1.before([stripBearerToken_1.stripBearerToken, awilix_express_1.inject(verifyAuth_1.verifyAuthProvider)]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    awilix_express_1.DELETE(),
    awilix_express_1.route('/me'),
    awilix_express_1.before([stripBearerToken_1.stripBearerToken, awilix_express_1.inject(verifyAuth_1.verifyAuthProvider)]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteMe", null);
UserController = __decorate([
    awilix_express_1.route('/api/v1/users'),
    __metadata("design:paramtypes", [Object, Object])
], UserController);
exports.UserController = UserController;
