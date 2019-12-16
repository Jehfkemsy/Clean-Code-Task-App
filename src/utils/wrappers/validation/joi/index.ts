import { ObjectSchema, ValidationError } from '@hapi/joi';

import { Either, left, right } from './../../../logic/Either';

type TErrorMessage = string;

/**
 * Validates a given candidate against its schema, returning an Either Monad result.
 * @param schema    A Joi Schema to validate the `candidate` against.
 * @param candidate A candidate object to validate against the `schema`.
 */
export const validate = <TCandidate>(schema: ObjectSchema, candidate: TCandidate): Either<TErrorMessage, TCandidate> => {
    try {
        schema.validate(candidate);
        return right(candidate);
    } catch (e) {
        return left((e as ValidationError).message);
    }
}