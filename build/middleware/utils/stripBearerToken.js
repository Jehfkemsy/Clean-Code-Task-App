"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** For a given Bearer Token of the form `Bearer <Token>, strips `<token>` removing `Bearer `.*/
exports.stripBearerToken = (req, res, next) => {
    try {
        req.token = req.header('Authorization').replace('Bearer ', '');
        next();
    }
    catch (e) {
        req.token = '';
    }
};
