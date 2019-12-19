import { ErrorHandlerFunction } from './errorHandlerProvider';

// Common, User, Auth Error Handlers.
import * as commonHandlers from './common/handlers';
import * as userHandlers from './user/handlers';
import * as authHandlers from './auth/handlers';


const handlerUnion: { [index: string]: ErrorHandlerFunction } = {
    ...commonHandlers,
    ...userHandlers,
    ...authHandlers
};

export const errorHandlers: ErrorHandlerFunction[] = [];

Object.keys(handlerUnion).forEach(key => errorHandlers.push(handlerUnion[key]));

export * from './errorHandlerProvider';

