"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../middleware/errors/index");
/**
 * Builds/loads the error handling middleware stack for the Express Application.
 * @param app Express Application
 */
exports.errorHandlerStackLoader = (app) => {
    index_1.errorHandlers.forEach(errorHandler => app.use(index_1.errorHandlerProvider(errorHandler)));
    app.use(index_1.catchAllHandler);
    console.log('scaffold');
    return app;
};
