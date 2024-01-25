import Joi from "joi";
import { ProductOut, RegInbounds, updateInbounds } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateInboundOrder(InboundRegData: RegInbounds) {
    const data = Joi.object<RegInbounds>({
        products: Joi.array().min(1).items(Joi.object<ProductOut>({
            productID: Joi.number().required(),
            quantity: Joi.number().required()
        })),
        supplierId: Joi.number().required(),
    });
    return data.validate(InboundRegData, options);
}

export function validateInboundOrderUpdate(InboundUpdateData: updateInbounds) {
    const data = Joi.object<updateInbounds>({
        quantity: Joi.number(),
        supplierId: Joi.number(),
        orderStatus: Joi.string().valid("processing", "canceled", "shipping", "delivered")
    });
    return data.validate(InboundUpdateData, options);
}
