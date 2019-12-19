"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Catch-all error handler. Bottom of stack.
 */
exports.catchAllHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    console.log(err);
    return res.status(500).send({ error: 'An unexpected error has occurred.' });
};
