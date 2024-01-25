import Joi from "joi";
import { Supplier } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateSupplier(regData: Supplier) {
    const data = Joi.object<Supplier>({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email(),
        address: Joi.string().required(),
        contactName: Joi.string(),
        contactPhone: Joi.string(),
        contactEmail: Joi.string().email()
    }).required();

    return data.validate(regData, options);
}

export function validateSupplierUpdate(regData: any) {
    const data = Joi.object({
        name: Joi.string(),
        phone: Joi.string(),
        email: Joi.string().email(),
        address: Joi.string(),
        contactName: Joi.string(),
        contactPhone: Joi.string(),
        contactEmail: Joi.string().email()
    });

    return data.validate(regData, options);
}
