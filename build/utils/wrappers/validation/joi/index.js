"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("./../../../logic/Either");
/**
 * Validates a given candidate against its schema, returning an Either Monad result.
 * @param schema    A Joi Schema to validate the `candidate` against.
 * @param candidate A candidate object to validate against the `schema`.
 */
exports.validate = (schema, candidate) => {
    try {
        schema.validate(candidate);
        return Either_1.right(candidate);
    }
    catch (e) {
        return Either_1.left(e.message);
    }
};
