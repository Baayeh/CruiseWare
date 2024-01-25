import Joi from "joi";
import { RegInventory } from "../../../utils/interfaces";

const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export function validateInventory(InventoryRegData: RegInventory) {
    const data = Joi.object<RegInventory>({
        name: Joi.string().min(2).max(30).required(),
        description: Joi.string().min(4).max(250).required()
    });
    return data.validate(InventoryRegData, options);
}

export function validateInventoryUpdate(InventoryUpdateData: RegInventory) {
    const data = Joi.object<RegInventory>({
        name: Joi.string().min(4).max(30),
        description: Joi.string().min(4).max(250)
    });
    return data.validate(InventoryUpdateData, options);
}