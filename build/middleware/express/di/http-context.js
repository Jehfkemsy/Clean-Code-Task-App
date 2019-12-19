"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
/**
 * Registers the bare HTTP Context into the Dependency Injection Container. Note that the HTTP Context
 * is not the Request Context - the latter contains data specific to a request, such as a user domain model,
 * while the former is only concerned with HTTP Artifacts.
 * @param req  The Express `request` object.
 * @param res  The Express `response` object.
 * @param next The Express `next` function.
 */
exports.registerHttpContext = (req, res, next) => {
    const httpContext = {
        req,
        res
    };
    req.container.register({
        httpContext: awilix_1.asValue(httpContext)
    });
    return next();
};
