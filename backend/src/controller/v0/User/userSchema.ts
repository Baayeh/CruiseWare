import Joi from "joi";
import { PasswordUpdate, RegUser, UserInterface } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateUserReg(Registration: RegUser) {
    const data = Joi.object<RegUser>({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        roleId: Joi.number().required()
    });
    return data.validate(Registration, options);
}

export function validateUserUpdate(profile: UserInterface) {
    const data = Joi.object<UserInterface>({
        firstName: Joi.string().min(3).max(30),
        lastName: Joi.string(),
    });
    return data.validate(profile, options);
}

export function validateUserPassword(SetPassword: string) {
    const data = Joi.object({
        password: Joi.string().min(6).max(30),
    });
    return data.validate(SetPassword, options);
}

export function validateUserPasswordUpdate(PasswordUpdate: PasswordUpdate) {
    const data = Joi.object<PasswordUpdate>({
        oldPassword: Joi.string().min(6).max(30),
        newPassword: Joi.string().min(6).max(30),
        retypeNewPassword: Joi.string().min(6).max(30),
    });
    return data.validate(PasswordUpdate, options);
}

export function validateUserDeactivation(DeactivateUser: string) {
    const data = Joi.object({
        userId: Joi.string().required(),
    });
    return data.validate(DeactivateUser, options);
}