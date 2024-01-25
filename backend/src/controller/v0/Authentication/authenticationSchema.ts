import Joi from "joi";
import { Login } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateLogin(loginData: Login) {
    const data = Joi.object<Login>({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(50).required(),
    });

    return data.validate(loginData, options);
}