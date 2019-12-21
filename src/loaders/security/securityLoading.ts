import express from 'express';
import helmet from 'helmet';

/**
 * Builds/loads the security loading stack for the provided Express Application.
 * @param app The target Express Application.
 */
export const securityStackLoader = (app: express.Application): express.Application => {
    app.use(helmet());
    return app;  
};