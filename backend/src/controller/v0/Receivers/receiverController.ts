import { Request, Response } from "express";
import { checkPermission, getFullNames } from "../../../utils/utilFunctions";
import { errorMessage, successMessage, handleError } from "../../../utils/responses";
import { validateReceiver, validateReceiverUpdate } from "./receiverSchema";
import { PrismaClient, Receiver } from '@prisma/client';
import { UserInterface } from "../../../utils/interfaces";

const db = new PrismaClient();

class Receivers {
    // Get all receivers, paginated or not
    public async getAllReceivers(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadAllReceivers", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch all receivers");
            }

            let allReceivers: Receiver[];
            let parsedPage: number = 0
            let parsedPageSize: number = 0
            if (req.query.page && req.query.pageSize) {
                const { page, pageSize } = req.query;
                parsedPage = parseInt(page as string, 10) || 1;
                parsedPageSize = parseInt(pageSize as string, 10) || 5;
                const skip = (parsedPage - 1) * parsedPageSize;

                allReceivers = await db.receiver.findMany({
                    where: { businessID: userData.businessID, deleted: false },
                    take: parsedPageSize,
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    skip
                })
            } else {
                allReceivers = await db.receiver.findMany({ where: { businessID: userData.businessID, deleted: false } });
            }

            const transformedReceivers = await Promise.all(allReceivers.map(async (filtered) => {
                const { createName, updateName } = await getFullNames(filtered.createdBy, filtered.updatedBy);

                filtered.createdBy = createName;
                filtered.updatedBy = updateName;

                const { deleted: deletedProp, ...filteredData } = filtered;

                return filteredData
            }));

            if (req.query.page && req.query.pageSize && parsedPage !== 0, parsedPageSize !== 0) {
                const totalReceiverCount = await db.receiver.count({
                    where: {
                        businessID: userData.businessID, deleted: false
                    }
                });

                const receiverData = {
                    totalReceiverCount,
                    currentPage: parsedPage,
                    pageSize: parsedPageSize,
                    receivers: transformedReceivers
                }

                return successMessage(res, 200, "Receivers fetched successfully", receiverData)
            } else {
                return successMessage(res, 200, "Receivers fetched successfully", transformedReceivers)
            }
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Get a receiver
    public async getReceiver(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadReceiver", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch a receiver");
            }

            const { receiverID } = req.params;

            const receiver = await db.receiver.findFirst({
                where: { id: parseInt(receiverID), businessID: userData.businessID, deleted: false }
            })
            if (!receiver) {
                return errorMessage(res, 404, "Receiver not found");
            }

            const { deleted: deletedProp, ...receiverData } = receiver;

            const users = await getFullNames(receiverData.createdBy, receiverData.updatedBy)

            receiverData.createdBy = users.createName;
            receiverData.updatedBy = users.updateName;

            return successMessage(res, 200, "Receiver fetched successfully", receiverData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Create a receiver
    public async createReceiver(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "CreateReceiver", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to create a receiver");
            }

            const { error, value } = validateReceiver(req.body);
            if (error) {
                return errorMessage(res, 400, error.message);
            }

            const user = await db.user.findFirst({ where: { email: userData.email } })
            if (!user) {
                return errorMessage(res, 401, "User not found");
            }

            const createdReceiver = await db.receiver.create({
                data: {
                    businessID: userData.businessID,
                    name: value.name,
                    phone: value.phone,
                    email: value.email,
                    address: value.address,
                    createdBy: user.id,
                    updatedBy: user.id,
                }
            })

            const { deleted: deletedProp, ...receiverData } = createdReceiver;

            const fullName: string = `${user.firstName} ${user.lastName}`;
            receiverData.createdBy = fullName;
            receiverData.updatedBy = fullName;

            return successMessage(res, 201, "Receiver created successfully", receiverData)
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Update a receiver
    public async updateReceiver(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateReceiver", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update a receiver");
            }

            const { receiverID } = req.params;

            const { error, value } = validateReceiverUpdate(req.body);
            if (error) {
                return errorMessage(res, 400, error.message);
            }

            const updatedData = await db.receiver.update({
                where: { id: parseInt(receiverID) },
                data: value
            });

            const { createName, updateName } = await getFullNames(updatedData.createdBy, updatedData.updatedBy);

            updatedData.createdBy = createName;
            updatedData.updatedBy = updateName;

            const { deleted: deletedProp, ...receiverData } = updatedData;

            return successMessage(res, 200, "Receiver updated successfully", receiverData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Delete a receiver
    public async deleteReceiver(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "DeleteReceiver", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to delete a receiver");
            }

            const { receiverID } = req.params;

            await db.receiver.update({
                where: { id: parseInt(receiverID) },
                data: {
                    deleted: true
                }
            });

            return successMessage(res, 200, "Receiver deleted successfully");
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

}

const receiver = new Receivers();
export default receiver;