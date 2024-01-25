import { Request, Response } from "express";
import { createId, isCuid } from "@paralleldrive/cuid2";
import { validateOutbounds, validateOutboundsUpdate } from "./outboundsSchema";
import { checkPermission, getFullNames } from "../../../utils/utilFunctions";
import { errorMessage, successMessage, handleError } from "../../../utils/responses";
import { PrismaClient, OutboundOrder, order_Status } from '@prisma/client';
import { UserInterface } from "../../../utils/interfaces";

const db = new PrismaClient();

class Outbounds {

    // Get all outbounds, paginated or not
    public async getAllOutbounds(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadOutbounds", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch outbounds");
            }

            let outbounds: OutboundOrder[];
            let parsedPage: number = 0
            let parsedPageSize: number = 0
            if (req.query.page && req.query.pageSize) {
                const { page, pageSize } = req.query;
                parsedPage = parseInt(page as string, 10) || 1;
                parsedPageSize = parseInt(pageSize as string, 10) || 5;
                const skip = (parsedPage - 1) * parsedPageSize;

                outbounds = await db.outboundOrder.findMany({
                    where: { businessID: userData.businessID, deleted: false },
                    take: parsedPageSize,
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    skip
                })
            } else {
                outbounds = await db.outboundOrder.findMany({ where: { businessID: userData.businessID, deleted: false } });
            }

            const transformedOutbounds = await Promise.all(outbounds.map(async (filtered) => {
                const { createName, updateName } = await getFullNames(filtered.createdBy, filtered.updatedBy);

                filtered.createdBy = createName;
                filtered.updatedBy = updateName;

                const { deleted: deletedProp, ...filteredData } = filtered;

                return filteredData
            }));

            if (req.query.page && req.query.pageSize && parsedPage !== 0, parsedPageSize !== 0) {
                const totalOutboundCount = await db.outboundOrder.count({
                    where: {
                        businessID: userData.businessID, deleted: false
                    }
                });

                const outboundsData = {
                    totalOutboundCount,
                    currentPage: parsedPage,
                    pageSize: parsedPageSize,
                    outbounds: transformedOutbounds
                }

                return successMessage(res, 200, "Outbounds fetched successfully", outboundsData)
            } else {
                return successMessage(res, 200, "Outbounds fetched successfully", transformedOutbounds)
            }
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Get an outbound by ID
    public async getOutbound(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadOutbounds", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch outbound");
            }

            const { outboundID } = req.params;

            const outbound = await db.outboundOrder.findFirst({
                where: { id: parseInt(outboundID), businessID: userData.businessID, deleted: false }
            })
            if (!outbound) {
                return errorMessage(res, 404, "Outbound not found");
            }

            const { deleted: deletedProp, ...outboundData } = outbound;

            const users = await getFullNames(outboundData.createdBy, outboundData.updatedBy)

            outboundData.createdBy = users.createName;
            outboundData.updatedBy = users.updateName;

            return successMessage(res, 200, "Outbound fetched successfully", outboundData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Get outbounds by OrderID or order status
    public async getOutboundsByID(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadOutbounds", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch outbounds");
            }

            const { status, orderID } = req.query;

            let outbounds: OutboundOrder[];

            const validStatusOptions = ['pending', 'processing', 'canceled', 'shipping', 'delivered'];

            if (status && orderID) {
                // Both status and orderID are not null

                if (isCuid(String(orderID)) && validStatusOptions.includes(String(status))) {
                    outbounds = await db.outboundOrder.findMany({
                        where: {
                            businessID: userData.businessID,
                            deleted: false,
                            orderId: String(orderID),
                            orderStatus: status as order_Status
                        }
                    });
                } else { return errorMessage(res, 400, `${orderID} or ${status} is invalid.`); }
            } else if (!status && orderID) {
                // status is null but orderID is valid

                if (isCuid(String(orderID))) {
                    outbounds = await db.outboundOrder.findMany({
                        where: {
                            businessID: userData.businessID,
                            deleted: false,
                            orderId: String(orderID)
                        }
                    });
                } else { return errorMessage(res, 400, `${orderID} is not in the right format.`); }
            } else if (status && !orderID) {
                // status is valid but orderID is null

                if (validStatusOptions.includes(String(status))) {
                    outbounds = await db.outboundOrder.findMany({
                        where: {
                            businessID: userData.businessID,
                            deleted: false,
                            orderStatus: status as order_Status
                        }
                    });
                } else { return errorMessage(res, 400, `${status} is invalid.`); }
            } else { return errorMessage(res, 400, "Please provide status and/or orderID"); }


            if (!outbounds) {
                return errorMessage(res, 404, "Outbound not found");
            }

            const filteredOutbounds = outbounds.filter((outbound) => !outbound.deleted);
            if (filteredOutbounds.length === 0) { return errorMessage(res, 404, "There are no outbound orders"); }

            const transformedOutbounds = await Promise.all(filteredOutbounds.map(async (filtered) => {
                const { createName, updateName } = await getFullNames(filtered.createdBy, filtered.updatedBy);

                filtered.createdBy = createName;
                filtered.updatedBy = updateName;

                const { deleted: deletedProp, ...filteredData } = filtered;

                return filteredData
            }));

            return successMessage(res, 200, "Outbounds fetched successfully", transformedOutbounds)
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Create outbound
    public async createOutbounds(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "CreateOutbound", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to create an outbound");
            }

            const { error, value } = validateOutbounds(req.body);
            if (error) { return errorMessage(res, 400, error.message); }

            const checkReceiver = await db.receiver.findFirst({
                where: {
                    id: value.receiverId,
                    businessID: userData.businessID,
                    deleted: false
                }
            })
            if (!checkReceiver) { return errorMessage(res, 404, `Receiver with ID ${value.receiverId} does not exist`); }

            for (const product of value.products) {
                const db_product = await db.product.findFirst({
                    where: {
                        id: product.productID,
                        inventory: {
                            id: product.inventoryID,
                            deleted: false,
                            businessID: userData.businessID
                        },
                        businessID: userData.businessID,
                        deleted: false
                    }
                })

                if (!db_product) {
                    return errorMessage(res, 400, `Product ${product.productID} not found in Inventory ${product.inventoryID}`);
                }
            }

            const user = await db.user.findFirst({ where: { email: userData.email } })
            if (!user) { return errorMessage(res, 401, "User not found"); }

            const orderID = createId()

            const createdOrder = await db.$transaction(async (db) => {
                value.products.forEach(async (product) => {
                    await db.outboundOrder.create({
                        data: {
                            businessID: userData.businessID,
                            orderId: orderID,
                            productId: product.productID,
                            receiverId: value.receiverId,
                            quantity: product.quantity,
                            orderStatus: "pending",
                            createdBy: user.id,
                            updatedBy: user.id
                        }
                    })
                })

                return await db.outboundOrder.findMany({ where: { orderId: orderID, businessID: userData.businessID, deleted: false } });
            })

            if (!createdOrder) { return errorMessage(res, 500, "Order not created"); }

            const transformedOrder = await Promise.all(createdOrder.map(async (filtered) => {
                const { createName, updateName } = await getFullNames(filtered.createdBy, filtered.updatedBy);

                filtered.createdBy = createName;
                filtered.updatedBy = updateName;

                const { deleted: deletedProp, ...filteredData } = filtered;

                return filteredData
            }));

            return successMessage(res, 201, "Outbounds fetched successfully", transformedOrder)
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Update outbound
    public async updateOutbound(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateOutbound", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update an outbound");
            }

            const { outboundID } = req.params;

            const { error, value } = validateOutboundsUpdate(req.body);
            if (error) {
                return errorMessage(res, 400, error.message);
            }

            const updatedData = await db.outboundOrder.update({
                where: { id: parseInt(outboundID) },
                data: value
            });

            const { deleted: deletedProp, ...outboundData } = updatedData;

            const { createName, updateName } = await getFullNames(outboundData.createdBy, outboundData.updatedBy);

            outboundData.createdBy = createName;
            outboundData.updatedBy = updateName;

            return successMessage(res, 200, "Outbound updated successfully", outboundData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Delete outbound
    public async deleteOutbound(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "DeleteOutbound", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to delete an outbound");
            }

            const { outboundID } = req.params;

            await db.outboundOrder.update({
                where: { id: parseInt(outboundID) },
                data: {
                    deleted: true
                }
            });

            return successMessage(res, 200, "Outbound deleted successfully");

        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }
}

const outbounds = new Outbounds();
export default outbounds;