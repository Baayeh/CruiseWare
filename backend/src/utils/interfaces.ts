/* eslint-disable camelcase */
import { order_Status } from "@prisma/client";

export interface UpdateData {
    name?: string;
    description?: string;
}

export interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    roleName: string;
    businessID: number;
}

export interface RegUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
}

export interface Login {
    email: string;
    password: string;
}

export interface BusinessContact {
    name: string;
    email: string;
    phone: string;
    address: Address;
}

export interface BusinessData {
    industry: string;
    regStatus: boolean;
    size: string;
    description: string;
}

export interface Address {
    id?: number;
    businessID?: number;
    name?: string;
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    timezone: string;
    description?: string;
}

export interface Register {
    user: RegUser;
    businessContact: BusinessContact;
    businessData: BusinessData;
}

export interface RegInventory {
    name: string;
    description: string;
}

export interface Receivers {
    name: string;
    email?: string;
    phone: string;
    address: string;

}
export interface RegProduct {
    name: string;
    quantity: number;
    price: number;
    inventoryId: number;
    description: string;
    fullDescription: string;
}

export interface RegInbounds {
    products: ProductOut[];
    supplierId: number;
}

export interface updateInbounds {
    quantity: number;
    supplierId: number;
    orderStatus: order_Status
}

export interface ProductUpdate {
    quantity: number;
    price: number;
    description: string;
    fullDescription: string;
}

export interface PasswordUpdate {
    oldPassword: string;
    newPassword: string;
    retypeNewPassword: string;
}

export interface Supplier {
    name: string;
    phone: string;
    email?: string;
    address: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
}

export interface Outbound {
    products: ProductOut[];
    receiverId: number;
}

export interface ProductOut {
    productID: number;
    inventoryID: number;
    quantity: number;
}

export interface BaseEmailSettings {
    from: string;
    mail_settings: {
      sandbox_mode: {
        enable: boolean;
      };
    };
  }

export type InboundOrderUpdateData = {
    orderStatus: order_Status;
    updatedBy: string;
  };