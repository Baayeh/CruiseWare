import Joi from "joi";
import { RegUser } from "./interfaces";

export const userSchema = Joi.object<RegUser>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required();