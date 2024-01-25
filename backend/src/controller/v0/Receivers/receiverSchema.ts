import Joi from "joi";
import { Receivers } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateReceiver(regData: Receivers) {
    const data = Joi.object<Receivers>({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email(),
        address: Joi.string().required(),
    }).required();

    return data.validate(regData, options);
}

export function validateReceiverUpdate(regData: any) {
    const data = Joi.object({
        name: Joi.string(),
        phone: Joi.string(),
        email: Joi.string().email(),
        address: Joi.string(),
    });

    return data.validate(regData, options);
}

