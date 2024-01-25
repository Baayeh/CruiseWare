import Joi from "joi";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validatePermissionsList(PermissionsList: string[]) {
    const data = Joi.object({
        permissions: Joi.array().items(Joi.string()).min(1).required()
    }).required();
    return data.validate(PermissionsList, options);
}