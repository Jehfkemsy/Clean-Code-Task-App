import { Request, Response } from 'express';
import { route, before, GET, POST, PATCH, DELETE, inject } from 'awilix-express';
import { celebrate } from 'celebrate';

import { BaseHTTPController } from './../../../common/controllers/BaseHTTPController';
import { IUserService } from './../services/UserService';

import { HTTP } from '../../../common/interfaces/interfaces';
import { CreateUserDTO, LoggedInUserResponseDTO, UserResponseDTO } from '../dtos';
import { UserCredentialsDTO, UpdateUserDTO } from './../dtos/index';

import { UserValidators } from '../validation/user-validation';

import { stripBearerToken } from './../../../middleware/utils/stripBearerToken';
import { verifyAuthProvider } from './../../../middleware/auth/verifyAuth';

import { AuthenticationErrors } from './../../auth/errors/index';

/**
 * HTTP Client interface/controller gateway to application for handling user-related operations.
 */
@route('/api/v1/users')
export class UserController extends BaseHTTPController {
    public constructor(private readonly userService: IUserService, httpContext: HTTP.IHttpContext) {
        super(httpContext);
    }

    @POST()
    @before(celebrate({ body: UserValidators.createUser }))
    async createUser(request: Request): Promise<Response> {
        await this.userService.signUpUser(request.body as CreateUserDTO);
        return this.createdOk();
    }

    @POST()
    @route('/login')
    @before(celebrate({ body: UserValidators.userCredentials }))
    async loginUser(request: Request): Promise<Response> {
        console.log('here')
        const loggedInResponseDTO = await this.userService.loginUser(request.body as UserCredentialsDTO);
        return this.withDTO<LoggedInUserResponseDTO>(loggedInResponseDTO);
    }

    @GET()
    @route('/me')
    @before([stripBearerToken, inject(verifyAuthProvider)])
    async getMe(request: Request): Promise<Response> {
        console.log('Made it to first controller');
        if (!request.user) throw AuthenticationErrors.AuthorizationError.create();
        const user = await this.userService.getUserById(request.user.id);
        return this.withDTO<UserResponseDTO>(user);
    }

    @PATCH()
    @route('/me')
    @before([stripBearerToken, inject(verifyAuthProvider)])
    async updateMe(request: Request): Promise<Response> {
        if (!request.user) throw AuthenticationErrors.AuthorizationError.create();
        await this.userService.updateUserById(request.user.id, request.body as UpdateUserDTO);
        return this.ok();
    }

    @DELETE()
    @route('/me')
    @before([stripBearerToken, inject(verifyAuthProvider)])
    async deleteMe(request: Request): Promise<Response> {
        if (!request.user) throw AuthenticationErrors.AuthorizationError.create();
        await this.userService.deleteUserById(request.user.id);
        return this.ok();
    }

    @GET()
    @route('/:id')
    async getUserById(request: Request): Promise<Response> {
        console.log('made it to wrong controller')
        const user = await this.userService.getUserById(request.params.id);
        return this.withDTO<UserResponseDTO>(user);
    }
}
