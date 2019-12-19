import express from 'express';

import { errorHandlers, errorHandlerProvider } from './../../middleware/errors/index';

export const errorHandlerStackLoader = (app: express.Application): express.Application => {
    errorHandlers.forEach(errorHandler => app.use(errorHandlerProvider(errorHandler)));
    // TODO: Catch-all error handler.
    return app;
}
