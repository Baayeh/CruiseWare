import Joi from "joi";
import { Register, BusinessContact, BusinessData, Address } from "../../../utils/interfaces";
import { userSchema } from "../../../utils/baseSchema";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateReg(regData: Register) {
    const data = Joi.object<Register>({
        user: userSchema,
        businessContact: Joi.object<BusinessContact>({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            address: Joi.object<Address>({
                street: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                country: Joi.string().required(),
                timezone: Joi.string().required()
            }).required(),
        }).required(),
        businessData: Joi.object<BusinessData>({
            industry: Joi.string().required(),
            regStatus: Joi.boolean().required(),
            size: Joi.string().required(),
            description: Joi.string().required()
        }).required(),
    });

    return data.validate(regData, options);
}