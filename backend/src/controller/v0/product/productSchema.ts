import Joi from "joi";
import { ProductUpdate, RegProduct } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateProduct(ProductRegData: RegProduct) {
    const data = Joi.object<RegProduct>({
        name: Joi.string().min(4).max(30).required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        inventoryId: Joi.number().required(),
        description: Joi.string().min(4).max(250).required(),
        fullDescription: Joi.string().min(4).max(500).required()
    });
    return data.validate(ProductRegData, options);
}

export function validateProductUpdate(ProductRegData: ProductUpdate) {
    const data = Joi.object<ProductUpdate>({
        quantity: Joi.number(),
        price: Joi.number(),
        description: Joi.string().min(4).max(250),
        fullDescription: Joi.string().min(4).max(500)
    });
    return data.validate(ProductRegData, options);
}