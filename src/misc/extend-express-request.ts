//import { Express } from 'express-serve-static-core';
import { AwilixContainer } from 'awilix';
import { User } from './../features/users/models/domain/user';

declare module 'express-serve-static-core' {
    interface Request {
        container: AwilixContainer,
        token?: string,
        user?: User
    }
}