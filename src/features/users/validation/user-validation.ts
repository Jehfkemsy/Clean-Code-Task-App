import Joi from '@hapi/joi';

/**
 * Common fields for user validation related operations.
 */
const userCommonFields = {
    firstName: Joi.string()
        .min(2)
        .max(20)
        .required(),

    lastName: Joi.string()
        .min(2)
        .max(30)
        .required(),

    username: Joi.string()
        .min(2)
        .max(20)
        .required(),

    biography: Joi.string()
        .min(2)
        .max(350)
        .required(),

    email: Joi.string()
        .email()
        .required(),
};

export namespace UserValidators {
    export const createUser = Joi.object().keys({
        ...userCommonFields,
    
        password: Joi.string()
            .regex(/[A-Z]/, { name: 'Has uppercase letters' })
            .regex(/[a-z]/, { name: 'Has lowercase letters' })
            .regex(/\d/, { name: 'Has numbers' })
            .regex(/\W/, { name: 'Has special characters' })
            .required()
    });  

    export const updateUser = Joi.object(userCommonFields)
        .optional();

    export const user = createUser.keys({
        id: Joi.string().required()
    });

    export const userCredentials = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
}
