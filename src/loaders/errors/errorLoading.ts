import express from 'express';

import { errorHandlers, errorHandlerProvider, catchAllHandler } from './../../middleware/errors/index';

/**
 * Builds/loads the error handling middleware stack for the Express Application.
 * @param app Express Application
 */
export const errorHandlerStackLoader = (app: express.Application): express.Application => {
    errorHandlers.forEach(errorHandler => app.use(errorHandlerProvider(errorHandler)));
    app.use(catchAllHandler);

    console.log('scaffold')

    return app;
}
