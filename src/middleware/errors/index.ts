import { ErrorHandlerFunction } from './other/errorHandlerProvider';

// Common, User, Auth, Application Error Handlers.
import * as commonHandlers from './common/handlers';
import * as userHandlers from './user/handlers';
import * as authHandlers from './auth/handlers';
import * as appHandlers from './application/handlers';


const handlerUnion: { [index: string]: ErrorHandlerFunction } = {
    ...commonHandlers,
    ...userHandlers,
    ...authHandlers,
    ...appHandlers
};

export const errorHandlers: ErrorHandlerFunction[] = [];

Object.keys(handlerUnion).forEach(key => errorHandlers.push(handlerUnion[key]));

export * from './other/errorHandlerProvider';
export * from './other/catchAllHandler';

