/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { omit } from "lodash";
import { PrismaClient } from "@prisma/client";
import { checkPermission } from "../../../utils/utilFunctions";
import {
  errorMessage,
  handleError,
  successMessage,
} from "../../../utils/responses";
import { validateInventory, validateInventoryUpdate } from "./inventorySchema";

const db = new PrismaClient();

class Inventory {
  public async newInventory(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "CreateInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to create inventory"
        );
      }

      const { error, value } = validateInventory(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      const createdInventory = await db.inventory.create({
        data: {
          name: value.name,
          businessID,
          description: value.description,
          createdBy: user!.id,
          updatedBy: user!.id,
        },
      });

      const inventory = {
        ...createdInventory,
        createdBy: `${user!.firstName} ${user!.lastName}`,
        updatedBy: `${user!.firstName} ${user!.lastName}`,
      };

      const { deleted, ...inventoryData } = inventory;

      return successMessage(res, 201, "Inventory created successfully", {
        inventoryData,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readInventory(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;
      const { inventoryId } = req.params;

      const permission = await checkPermission(
        roleName,
        "ReadInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read inventory"
        );
      }

      const inventory = await db.inventory.findFirst({
        where: { id: Number(inventoryId), businessID, deleted: false },
        include: {
          created: true,
          update: true,
          product: {
            where: { businessID },
            select: {
              create: true,
              update: true,
            },
          },
        },
      });
      if (!inventory) {
        return errorMessage(res, 404, "Inventory not found");
      }

      const inventoryDataUpdate = {
        ...inventory,
        productCount: `${inventory.product.length}`,
        createdBy: `${inventory.created.firstName} ${inventory.created.lastName}`,
        updatedBy: `${inventory.update!.firstName} ${
          inventory.update!.lastName
        }`,
      };

      const productDataUpdate = inventoryDataUpdate.product.map((product) => ({
        ...product,
        createdBy: `${product.create.firstName} ${product.create.lastName}`,
        updatedBy: `${product.update!.firstName} ${product.update!.lastName}`,
      }));

      const productsWithoutCreateAndUpdate = productDataUpdate.map((product) =>
        omit(product, ["create", "update"])
      );
      const { deleted, created, update, ...inventoryData } =
        inventoryDataUpdate;
      return successMessage(res, 200, "Inventory fetched", {
        ...inventoryData,
        product: productsWithoutCreateAndUpdate,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllInventory(req: Request, res: Response) {
    try {
      const { page, pageSize, search } = req.query;
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read inventory"
        );
      }

      const parsedPage = parseInt(page as string, 10) || 1;
      const parsedPageSize = parseInt(pageSize as string, 10) || 5;
      const skip = (parsedPage - 1) * parsedPageSize;
      let totalInventoryCount;
      let inventories;

      if (search) {
        inventories = await db.inventory.findMany({
          where: {
            businessID,
            deleted: false,
            ...(search && {
              OR: [
                {
                  name: {
                    contains: search as string,
                  },
                },
                {
                  description: {
                    contains: search as string,
                  },
                },
              ],
            }),
          },
          orderBy: {
            updatedAt: "asc",
          },
          take: parsedPageSize,
          skip,
          include: {
            created: true,
            update: true,
            product: true,
          },
        });

        totalInventoryCount = inventories.length;
      } else {
        totalInventoryCount = await db.inventory.count({
          where: { businessID, deleted: false },
        });
  
        inventories = await db.inventory.findMany({
          where: {
            businessID,
            deleted: false,
          },
          orderBy: {
            updatedAt: "asc",
          },
          take: parsedPageSize,
          skip,
          include: {
            created: true,
            update: true,
            product: true,
          },
        });
      }

      const inventoriesDataUpdate = inventories.map((inventory) => ({
        ...inventory,
        productCount: `${inventory.product.length}`,
        createdBy: `${inventory.created.firstName} ${inventory.created.lastName}`,
        updatedBy: `${inventory.update!.firstName} ${
          inventory.update!.lastName
        }`,
      }));

      const totalProductsCount = inventories.reduce(
        (sum, inventory) => sum + inventory.product.length,
        0
      );
      if (inventories.length === 0) {
        return errorMessage(res, 404, "Inventory is empty");
      }

      return successMessage(res, 200, "Inventories Fetched Successfully", {
        totalProductsCount,
        totalInventoryCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        inventory: inventoriesDataUpdate.map(
          ({ deleted, created, update, product, ...inventory }) => inventory
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllInventoryUnPaginated(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read inventory"
        );
      }

      const inventories = await db.inventory.findMany({
        where: { businessID, deleted: false },
        include: {
          created: true,
          update: true,
          product: {
            where: {
              businessID,
            },
          },
        },
      });

      const inventoriesDataUpdate = inventories.map((inventory) => ({
        ...inventory,
        productCount: `${inventory.product.length}`,
        createdBy: `${inventory.created.firstName} ${inventory.created.lastName}`,
        updatedBy: `${inventory.update!.firstName} ${
          inventory.update!.lastName
        }`,
      }));

      if (inventories.length === 0) {
        return errorMessage(res, 404, "Inventory is empty");
      }

      return successMessage(res, 200, "Inventories Fetched Successfully", {
        inventory: inventoriesDataUpdate.map(
          ({ deleted, created, update, product, ...inventory }) => inventory
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async updateInventory(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { inventoryId } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "UpdateInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to update an inventory"
        );
      }

      const inventory = await db.inventory.findFirst({
        where: { id: Number(inventoryId), businessID, deleted: false },
        include: {
          created: true,
        },
      });
      if (!inventory) {
        return errorMessage(res, 404, "Inventory not found");
      }

      const { error, value } = validateInventoryUpdate(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      const updatedInventoryData = {
        ...(value.name && { name: value.name }),
        ...(value.description && { description: value.description }),
        updatedBy: user!.id,
      };
      const updatedInventory = await db.inventory.update({
        where: { id: Number(inventoryId) },
        data: updatedInventoryData,
        include: {
          created: true,
        },
      });

      const inventoryDataUpdate = {
        ...updatedInventory,
        createdBy: `${updatedInventory.created.firstName} ${updatedInventory.created.lastName}`,
        updatedBy: `${user!.firstName} ${user!.lastName}`,
      };

      const { deleted, created, ...inventoryData } = inventoryDataUpdate;

      return successMessage(res, 200, "Inventory item updated successfully", {
        inventoryData,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async deleteInventory(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { inventoryId } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "DeleteInventory",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to delete inventory"
        );
      }

      const inventory = await db.inventory.findFirst({
        where: { id: Number(inventoryId), businessID },
      });
      if (!inventory || inventory.deleted) {
        return errorMessage(res, 404, "Inventory not found");
      }

      await db.inventory.update({
        where: { id: Number(inventoryId) },
        data: {
          deleted: true,
          updatedBy: user!.id,
        },
      });

      return successMessage(res, 200, "Inventory item deleted successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async deletedInventories(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      if (roleName !== "superadmin") {
        return errorMessage(
          res,
          403,
          "You are not authorized to view deleted inventory"
        );
      }

      const totalDeletedInventoryCount = await db.inventory.count({
        where: { businessID, deleted: true },
      });

      if (totalDeletedInventoryCount === 0) {
        return errorMessage(res, 404, "No deleted inventory");
      }

      return successMessage(
        res,
        200,
        "Deleted Inventories count fetched Successfully",
        {
          totalDeletedInventoryCount,
        }
      );
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
}

const inventory = new Inventory();
export default inventory;
