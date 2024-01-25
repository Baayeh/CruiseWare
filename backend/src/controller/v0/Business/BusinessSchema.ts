import { BusinessHours, BusinessLocations, BusinessSocials } from "@prisma/client";
import Joi from "joi";
import { Address } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    allowUnknown: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateBusinessUpdate(updateData: any) {
    const dataSchema = Joi.object({
        businessData: Data,
        businessSocials: Socials,
        businessLocations: Locations,
        businessHours: Hours
    }).xor("businessData", "businessSocials", "businessLocations", "businessHours");

    return dataSchema.validate(updateData, options);
}

export function validateLocations(updateData: any) {
    const dataSchema = Locations.required()

    return dataSchema.validate(updateData, options);
}

export function validateData(updateData: any) {
    const dataSchema = Data.required()

    return dataSchema.validate(updateData, options);
}

export function validateSocials(updateData: any) {
    const dataSchema = Socials.required()

    return dataSchema.validate(updateData, options);
}

export function validateHours(updateData: any) {
    const dataSchema = Hours.required()

    return dataSchema.validate(updateData, options);
}


export function validateCreateHours(updateData: any) {
    const dataSchema = Joi.object<BusinessHours>({
        businessID: Joi.number().integer().required(),
        locationID: Joi.number().integer().required(),
        day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
        start: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/).required(),
        end: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/).required()
    }).required()

    return dataSchema.validate(updateData, options);
}


export function validateCreateLocations(updateData: any) {
    const dataSchema = Joi.object<BusinessLocations>({
        businessID: Joi.number().integer().required(),
        name: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string(),
        country: Joi.string().required(),
        timezone: Joi.string().required(),
        description: Joi.string()
    }).required()

    return dataSchema.validate(updateData, options);
}


export function validateCreateSocials(updateData: any) {
    const dataSchema = Joi.object<BusinessSocials>({
        businessID: Joi.number().integer().required(),
        Twitter: Joi.string().uri(),
        Facebook: Joi.string().uri(),
        LinkedIn: Joi.string().uri(),
        Instagram: Joi.string().uri(),
        Tiktok: Joi.string().uri(),
    }).required()

    return dataSchema.validate(updateData, options);
}


const Locations = Joi.object<Address>({
    id: Joi.number().integer().required(),
    businessID: Joi.number().integer().required(),
    name: Joi.string(),
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
    timezone: Joi.string(),
    description: Joi.string()
})


const Data = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    website: Joi.string().uri(),
    industry: Joi.string(),
    regStatus: Joi.boolean(),
    regNumber: Joi.string(),
    colour: Joi.string(),
    description: Joi.string(),
    size: Joi.string().valid("sole_Proprietorship", "small", "medium", "large", "enterprise")
})


const Socials = Joi.object({
    id: Joi.number().integer().required(),
    businessID: Joi.number().integer().required(),
    Twitter: Joi.string().uri(),
    Facebook: Joi.string().uri(),
    LinkedIn: Joi.string().uri(),
    Instagram: Joi.string().uri(),
    Tiktok: Joi.string().uri(),
})


const Hours = Joi.object({
    id: Joi.number().integer().required(),
    businessID: Joi.number().integer().required(),
    locationID: Joi.number().integer().required(),
    day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
    start: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
    end: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/)
})
