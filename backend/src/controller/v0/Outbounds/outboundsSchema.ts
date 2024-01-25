import Joi from "joi";
import { Outbound, ProductOut } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateOutbounds(regData: any) {
    const data = Joi.object<Outbound>({
        products: Joi.array().min(1).items(Joi.object<ProductOut>({
            productID: Joi.number().required(),
            inventoryID: Joi.number().required(),
            quantity: Joi.number().required()
        })).required(),
        receiverId: Joi.number().required()
    }).required();

    return data.validate(regData, options);
}

export function validateOutboundsUpdate(regData: any) {
    const data = Joi.object({
        productId: Joi.number(),
        receiverId: Joi.number(),
        quantity: Joi.number(),
        orderStatus: Joi.string().valid('pending', 'processing', 'canceled', 'shipping', 'delivered')
    });

    return data.validate(regData, options);
}