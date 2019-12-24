import { ObjectSchema, ValidationError } from '@hapi/joi';

import { Either, left, right } from './../../../logic/Either';

type TErrorMessage = string;

/**
 * Validates a given candidate against its schema, returning an Either Monad result.
 * @param schema    A Joi Schema to validate the `candidate` against.
 * @param candidate A candidate object to validate against the `schema`.
 */
export const validate = <TCandidate>(schema: ObjectSchema, candidate: TCandidate): Either<TErrorMessage, TCandidate> => {
    const { error, value } = schema.validate(candidate);

    if (error) {
        return left((error as ValidationError).message);
    } else {
        return right(value);
    }
}