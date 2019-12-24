import Joi from '@hapi/joi';

/**
 * Common fields for user validation related operations.
 */
const userCommonFields: { [key: string]: Joi.AnySchema } = {
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

const joiGenericMapper = (
    toModify: Joi.SchemaMap, 
    modifier: (currSchema: Joi.AnySchema) => Joi.AnySchema
): Joi.SchemaMap => {
    const modifiedObject: Joi.SchemaMap = {};

    Object.keys(toModify).map((key) => {
        modifiedObject[key] = modifier(userCommonFields[key]);
    });

    return modifiedObject;
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

    export const updateUser = Joi.object(joiGenericMapper(userCommonFields, currSchema => currSchema.optional()));

    export const user = createUser.keys({
        id: Joi.string().required()
    });

    export const userCredentials = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
}