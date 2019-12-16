import express from 'express';
import { asValue } from 'awilix';

import { HTTP } from './../../../common/interfaces/interfaces';

/**
 * Registers the bare HTTP Context into the Dependency Injection Container. Note that the HTTP Context
 * is not the Request Context - the latter contains data specific to a request, such as a user domain model,
 * while the former is only concerned with HTTP Artifacts.
 * @param req  The Express `request` object.
 * @param res  The Express `response` object.
 * @param next The Express `next` function.
 */
export const registerHttpContext = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const httpContext: HTTP.IHttpContext = {
        req, 
        res
    };

    req.container.register({
        httpContext: asValue(httpContext)
    });

    next();
}