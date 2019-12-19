import express from 'express';

import { AwilixContainer } from 'awilix';

import { securityLoaders } from './loaders/security';

import { scopePerRequest, loadControllers } from 'awilix-express';
import { registerHttpContext } from './middleware/express/di/http-context';
import { errorHandlerStackLoader } from './loaders/errors/errorLoading';

import { errors } from 'celebrate';


export default (container: AwilixContainer): express.Application => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(scopePerRequest(container));
    app.use(registerHttpContext);
    app.use(loadControllers('./../build/features/*/controllers/*.js', { cwd: __dirname }));

    securityLoaders.forEach(loader => app.use(loader));

   // errorHandlerStackLoader(app);
    app.use(errors());
    

    console.log('give back')

    return app;
}

process.on('uncaughtException', (err) => {
    console.log(err)
})