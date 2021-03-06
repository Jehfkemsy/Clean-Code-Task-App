import express from 'express';

import { AwilixContainer } from 'awilix';

import { securityLoaders, securityStackLoader } from './loaders/security/securityLoading';
import { errorHandlerStackLoader } from './loaders/errors/errorLoading';

import { scopePerRequest, loadControllers } from 'awilix-express';
import { registerHttpContext } from './middleware/express/di/http-context';

export default (container: AwilixContainer): express.Application => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(scopePerRequest(container));
    app.use(registerHttpContext);
    app.use(loadControllers('./../build/features/*/controllers/*.js', { cwd: __dirname }));

    // Middleware Stackers
    securityStackLoader(app);
    errorHandlerStackLoader(app);

    return app;
};