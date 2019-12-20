import express from 'express';

import { errorHandlers, errorHandlerProvider, catchAllHandler } from './../../middleware/errors/index';
import { errors } from 'celebrate';

/**
 * Builds/loads the error handling middleware stack for the Express Application.
 * @param app Express Application
 */
export const errorHandlerStackLoader = (app: express.Application): express.Application => {
    // Per-Namespace, Celebrate, and Generic Catch-All Error Handlers.
    errorHandlers.forEach(errorHandler => app.use(errorHandlerProvider(errorHandler)));
    app.use(errors());
    app.use(catchAllHandler);

    console.log('Applied error handling middleware functions to Express stack');

    return app;
}
