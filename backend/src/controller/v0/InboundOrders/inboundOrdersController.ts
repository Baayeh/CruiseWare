/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { omit } from "lodash";
import {
  InboundOrderUpdateData,
  UserInterface,
} from "../../../utils/interfaces";
import {
  checkPermission,
  generateReference,
  getFullNames,
} from "../../../utils/utilFunctions";
import {
  validateInboundOrder,
  validateInboundOrderUpdate,
} from "./inboundOrdersSchema";
import {
  errorMessage,
  handleError,
  successMessage,
} from "../../../utils/responses";

const db = new PrismaClient();

class InboundOrder {
  public async createInboundOrder(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;

      const user = await db.user.findFirst({
        where: { email },
      });

      const hasPermission = await checkPermission(
        roleName,
        "CreateInbound",
        businessID
      );
      if (!hasPermission) {
        return errorMessage(
          res,
          403,
          "You don't have the permission to create an Inbound Order"
        );
      }

      const { error, value } = validateInboundOrder(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      const reference = generateReference();

      if (!Array.isArray(value.products)) {
        return errorMessage(
          res,
          400,
          "Invalid 'products' data. Expected an array."
        );
      }

      const productIDs = value.products.map((product) => product.productID);
      const dbProducts = await db.product.findMany({
        where: {
          id: { in: productIDs },
          businessID,
          deleted: false,
        },
      });

      await db.$transaction(async (db) => {
        await Promise.all(
          value.products.map(async (product) => {
            await db.inboundOrder.create({
              data: {
                businessID,
                productId: product.productID,
                reference,
                supplierId: value.supplierId,
                quantity: product.quantity,
                createdBy: user!.id,
                updatedBy: user!.id,
              },
            });
          })
        );
      });

      const createdOrder = await db.inboundOrder.findMany({
        where: { businessID, reference, deleted: false },
      });

      if (!createdOrder || createdOrder.length === 0) {
        return errorMessage(res, 500, "Order not created");
      }

      const transformedOrder = await Promise.all(
        createdOrder.map(async (filtered) => {
          const { createName, updateName } = await getFullNames(
            filtered.createdBy,
            filtered.updatedBy
          );

          filtered.createdBy = createName;
          filtered.updatedBy = updateName;

          const { deleted, ...filteredData } = filtered;

          return filteredData;
        })
      );

      return successMessage(res, 201, "Inbound Order Created successfully", {
        transformedOrder,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readInboundOrder(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;
      const { reference } = req.params;
      const permission = await checkPermission(
        roleName,
        "ReadInbounds",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read Inbound Order"
        );
      }
      const inboundOrders = await db.inboundOrder.findMany({
        where: {
          reference,
          businessID,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          create: true,
          update: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              create: true,
              update: true,
            },
          },
        },
      });

      if (inboundOrders.length === 0) {
        return errorMessage(res, 404, "No Inbound Orders found");
      }

      const processedInboundOrders = inboundOrders.map((inboundOrder) => {
        const inboundOrderDataUpdate = {
          ...inboundOrder,
          createdBy: `${inboundOrder.create.firstName} ${inboundOrder.create.lastName}`,
          updatedBy: `${inboundOrder.update!.firstName} ${
            inboundOrder.update!.lastName
          }`,
        };
        const productWithoutDelete = omit(inboundOrder.product, [
          "deleted",
          "create",
          "update",
        ]);
        const { deleted, create, update, ...inboundOrderData } =
          inboundOrderDataUpdate;

        return {
          ...inboundOrderData,
          product: productWithoutDelete,
        };
      });

      return successMessage(
        res,
        200,
        "Inbound Orders fetched Successfully",
        processedInboundOrders
      );
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllInboundOrder(req: Request, res: Response) {
    try {
      const { property, order } = req.params;
      const { page, pageSize } = req.query;
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadInbounds",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read Inbound Order"
        );
      }

      const parsedPage = parseInt(page as string, 10) || 1;
      const parsedPageSize = parseInt(pageSize as string, 10) || 5;

      const referenceCounts = await db.inboundOrder.groupBy({
        by: ["reference"],
        where: {
          businessID,
          deleted: false,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        _count: {
          reference: true,
        },
      });

      const totalInboundOrderCount = referenceCounts.length;

      const skip = (parsedPage - 1) * parsedPageSize;

      const inboundOrders = await db.inboundOrder.findMany({
        where: {
          businessID,
          deleted: false,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        take: parsedPageSize,
        skip,
        include: {
          product: true,
          create: true,
          update: true,
        },
      });

      const inboundOrderDataUpdate = inboundOrders.map((inboundOrder) => ({
        ...inboundOrder,
        createdBy: `${inboundOrder.create.firstName} ${inboundOrder.create.lastName}`,
        updatedBy: `${inboundOrder.update!.firstName} ${
          inboundOrder.update!.lastName
        }`,
      }));

      if (inboundOrders.length === 0) {
        return errorMessage(res, 404, "Inbound Order is empty");
      }

      return successMessage(res, 200, "Inbound Orders Fetched Successfully", {
        totalInboundOrderCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        inboundOrders: inboundOrderDataUpdate.map(
          ({ deleted, create, update, product, ...inboundOrder }) =>
            inboundOrder
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllInboundOrdersUnPaginated(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadInbounds",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read Inbound Order"
        );
      }

      const inboundOrders = await db.inboundOrder.findMany({
        where: {
          businessID,
          deleted: false,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          product: true,
          create: true,
          update: true,
        },
      });

      const inboundOrderDataUpdate = inboundOrders.map((inboundOrder) => ({
        ...inboundOrder,
        createdBy: `${inboundOrder.create.firstName} ${inboundOrder.create.lastName}`,
        updatedBy: `${inboundOrder.update!.firstName} ${
          inboundOrder.update!.lastName
        }`,
      }));

      if (inboundOrders.length === 0) {
        return errorMessage(res, 404, "Inbound Order not found");
      }

      return successMessage(res, 200, "Inbound Orders Fetched Successfully", {
        inboundOrders: inboundOrderDataUpdate.map(
          ({ deleted, create, update, product, ...inboundOrder }) =>
            inboundOrder
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async updateInboundOrder(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { reference } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "UpdateInbound",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to update an Inbound Order"
        );
      }

      const inboundOrders = await db.inboundOrder.findMany({
        where: {
          reference,
          businessID,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        select: {
          id: true,
          quantity: true,
          create: true,
          product: {
            select: {
              quantity: true,
            },
          },
        },
      });

      if (inboundOrders.length === 0) {
        return errorMessage(res, 404, "No Inbound Orders found");
      }

      const { error, value } = validateInboundOrderUpdate(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      const updatedInboundOrderDataArray = [];

      for (const inboundOrder of inboundOrders) {
        const updateData: InboundOrderUpdateData = {
          orderStatus: value.orderStatus,
          updatedBy: user!.id,
        };

        const updatedInboundOrder = await db.inboundOrder.update({
          where: { reference, id: inboundOrder.id },
          data: updateData,
          include: {
            create: true,
            update: true,
            product: true,
          },
        });

        if (value.orderStatus === "delivered") {
          const newQuantity =
            inboundOrder.quantity + inboundOrder.product.quantity;

          await db.product.update({
            where: {
              id: updatedInboundOrder.product.id,
              businessID,
            },
            data: {
              quantity: newQuantity,
            },
          });
        }

        const createdBy = `${updatedInboundOrder.create.firstName} ${updatedInboundOrder.create.lastName}`;
        const updatedBy = `${user!.firstName} ${user!.lastName}`;

        const { deleted, create, update, product, ...inboundOrderData } =
          updatedInboundOrder;

        updatedInboundOrderDataArray.push({
          ...inboundOrderData,
          createdBy,
          updatedBy,
        });
      }

      return successMessage(
        res,
        200,
        "Inbound Orders updated successfully",
        updatedInboundOrderDataArray
      );
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async deleteInboundOrder(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { reference } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "DeleteInbound",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to delete an Inbound Order"
        );
      }

      const inboundOrders = await db.inboundOrder.findMany({
        where: {
          reference,
          businessID,
          deleted: false,
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
      });

      if (inboundOrders.length === 0) {
        return errorMessage(res, 404, "Inbound Order not found");
      }

      for (const inboundOrder of inboundOrders) {
        await db.inboundOrder.update({
          where: { id: inboundOrder.id },
          data: {
            deleted: true,
            updatedBy: user!.id,
          },
        });
      }

      return successMessage(res, 200, "Inbound Orders deleted successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
}

const inboundOrder = new InboundOrder();
export default inboundOrder;
