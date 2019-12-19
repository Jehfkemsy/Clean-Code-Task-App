"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const security_1 = require("./loaders/security");
const awilix_express_1 = require("awilix-express");
const http_context_1 = require("./middleware/express/di/http-context");
const celebrate_1 = require("celebrate");
exports.default = (container) => {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(awilix_express_1.scopePerRequest(container));
    app.use(http_context_1.registerHttpContext);
    app.use(awilix_express_1.loadControllers('./../build/features/*/controllers/*.js', { cwd: __dirname }));
    security_1.securityLoaders.forEach(loader => app.use(loader));
    // errorHandlerStackLoader(app);
    app.use(celebrate_1.errors());
    console.log('give back');
    return app;
};
process.on('uncaughtException', (err) => {
    console.log(err);
});
