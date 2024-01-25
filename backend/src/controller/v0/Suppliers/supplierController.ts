import { Request, Response } from "express";
import { checkPermission, getFullNames } from "../../../utils/utilFunctions";
import { errorMessage, successMessage, handleError } from "../../../utils/responses";
import { validateSupplier, validateSupplierUpdate } from "./supplierSchema";
import { PrismaClient, Supplier } from '@prisma/client';
import { UserInterface } from "../../../utils/interfaces";

const db = new PrismaClient();

class Suppliers {
    public async getAllSuppliers(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadAllSuppliers", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch all suppliers");
            }

            let allSuppliers: Supplier[];
            let parsedPage: number = 0
            let parsedPageSize: number = 0
            if (req.query.page && req.query.pageSize) {
                const { page, pageSize } = req.query;
                parsedPage = parseInt(page as string, 10) || 1;
                parsedPageSize = parseInt(pageSize as string, 10) || 5;
                const skip = (parsedPage - 1) * parsedPageSize;

                allSuppliers = await db.supplier.findMany({
                    where: { businessID: userData.businessID, deleted: false },
                    take: parsedPageSize,
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    skip
                })
            } else {
                allSuppliers = await db.supplier.findMany({ where: { businessID: userData.businessID, deleted: false } });
            }

            const transformedSuppliers = await Promise.all(allSuppliers.map(async (filtered) => {
                const { createName, updateName } = await getFullNames(filtered.createdBy, filtered.updatedBy);

                filtered.createdBy = createName;
                filtered.updatedBy = updateName;

                const { deleted: deletedProp, ...filteredData } = filtered;

                return filteredData
            }));

            if (req.query.page && req.query.pageSize && parsedPage !== 0, parsedPageSize !== 0) {
                const totalSupplierCount = await db.supplier.count({
                    where: {
                        businessID: userData.businessID, deleted: false
                    }
                });

                const supplierData = {
                    totalSupplierCount,
                    currentPage: parsedPage,
                    pageSize: parsedPageSize,
                    suppliers: transformedSuppliers
                }

                return successMessage(res, 200, "Suppliers fetched successfully", supplierData)
            } else {
                return successMessage(res, 200, "Suppliers fetched successfully", transformedSuppliers)
            }
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    public async getSupplier(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadSupplier", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch a supplier");
            }

            const { supplierID } = req.params;

            const supplier = await db.supplier.findFirst({
                where: { id: parseInt(supplierID), deleted: false }
            })
            if (!supplier) {
                return errorMessage(res, 404, "Supplier not found");
            }

            const { deleted: deletedProp, ...supplierData } = supplier;

            const users = await getFullNames(supplierData.createdBy, supplierData.updatedBy)

            supplierData.createdBy = users.createName;
            supplierData.updatedBy = users.updateName;

            return successMessage(res, 200, "Supplier fetched successfully", supplierData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    public async createSupplier(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "CreateSupplier", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to create a supplier");
            }

            const { error, value } = validateSupplier(req.body);
            if (error) {
                return errorMessage(res, 400, error.message);
            }

            const supplier = await db.supplier.findFirst({
                where: { name: value.name, businessID: userData.businessID, deleted: false }
            })
            if (supplier) {
                return errorMessage(res, 401, `Supplier with name ${value.name} already exists`);
            }

            const user = await db.user.findFirst({ where: { email: userData.email } })
            if (!user) {
                return errorMessage(res, 401, "User not found");
            }

            const createdSupplier = await db.supplier.create({
                data: {
                    businessID: userData.businessID,
                    name: value.name,
                    phone: value.phone,
                    email: value.email,
                    address: value.address,
                    contactName: value.contactName,
                    contactPhone: value.contactPhone,
                    contactEmail: value.contactEmail,
                    createdBy: user.id,
                    updatedBy: user.id,
                }
            })

            const { deleted: deletedProp, ...supplierData } = createdSupplier;

            const fullName: string = `${user.firstName} ${user.lastName}`;
            supplierData.createdBy = fullName;
            supplierData.updatedBy = fullName;

            return successMessage(res, 201, "Supplier created successfully", supplierData)
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    public async updateSupplier(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateSupplier", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update a supplier");
            }

            const { supplierID } = req.params;

            const { error, value } = validateSupplierUpdate(req.body);
            if (error) {
                return errorMessage(res, 400, error.message);
            }

            const updatedData = await db.supplier.update({
                where: { id: parseInt(supplierID) },
                data: value
            });

            const { createName, updateName } = await getFullNames(updatedData.createdBy, updatedData.updatedBy);

            updatedData.createdBy = createName;
            updatedData.updatedBy = updateName;

            const { deleted: deletedProp, ...supplierData } = updatedData;

            return successMessage(res, 200, "Supplier updated successfully", supplierData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    public async deleteSupplier(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "DeleteSupplier", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to delete a supplier");
            }

            const { supplierID } = req.params;

            await db.supplier.update({
                where: { id: parseInt(supplierID) },
                data: {
                    deleted: true
                }
            });

            return successMessage(res, 200, "Supplier deleted successfully");
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }
}

const supplier = new Suppliers();
export default supplier;