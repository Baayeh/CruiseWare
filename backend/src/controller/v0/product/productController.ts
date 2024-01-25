/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { checkPermission } from "../../../utils/utilFunctions";
import { validateProduct, validateProductUpdate } from "./productSchema";
import {
  errorMessage,
  handleError,
  successMessage,
} from "../../../utils/responses";

const db = new PrismaClient();

class Product {
  public async newProduct(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;

      const user = await db.user.findFirst({
        where: { email },
      });
      const permission = await checkPermission(
        roleName,
        "CreateProduct",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to create product"
        );
      }
      const { error, value } = validateProduct(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      let photo;
      if (req.file) {
        photo = req.file.path;
      }
      const createdProduct = await db.product.create({
        data: {
          name: value.name,
          quantity: Number(value.quantity),
          price: Number(value.price),
          photo,
          inventoryId: Number(value.inventoryId),
          description: value.description,
          fullDescription: value.fullDescription,
          businessID,
          createdBy: user!.id,
          updatedBy: user!.id,
        },
      });

      const product = {
        ...createdProduct,
        createdBy: `${user!.firstName} ${user!.lastName}`,
        updatedBy: `${user!.firstName} ${user!.lastName}`,
      };

      const { deleted, ...productData } = product;
      return successMessage(res, 201, "Product Created Successfully", {
        productData,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readProduct(req: Request, res: Response) {
    try {
      const { businessID } = req.user;
      const { productId } = req.params;

      const product = await db.product.findFirst({
        where: {
          id: Number(productId),
          businessID,
          deleted: false,
          inventory: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          create: true,
          update: true,
        },
      });

      if (!product) return errorMessage(res, 404, "Product not found");

      const productDataUpdate = {
        ...product,
        createdBy: `${product.create.firstName} ${product.create.lastName}`,
        updatedBy: `${product.update!.firstName} ${product.update!.lastName}`,
      };
      const { deleted, create, update, ...productData } = productDataUpdate;
      return successMessage(res, 200, "Product fetched Successfully", {
        productData,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllProduct(req: Request, res: Response) {
    try {
      const { page, pageSize, search } = req.query;
      const { businessID } = req.user;

      let totalProductCount;
      let products;
      const parsedPage = parseInt(page as string, 10) || 1;
      const parsedPageSize = parseInt(pageSize as string, 10) || 5;
      const skip = (parsedPage - 1) * parsedPageSize;

      if (search) {
        products = await db.product.findMany({
          where: {
            businessID,
            deleted: false,
            inventory: {
              NOT: {
                deleted: true,
              },
            },
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
            create: true,
            update: true,
          },
        });

        totalProductCount = products.length;
      } else {
        totalProductCount = await db.product.count({
          where: {
            businessID,
            deleted: false,
            inventory: {
              NOT: {
                deleted: true,
              },
            },
          },
        });

        products = await db.product.findMany({
          where: {
            businessID,
            deleted: false,
            inventory: {
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
            create: true,
            update: true,
          },
        });
      }

      const productDataUpdate = products.map((product) => ({
        ...product,
        createdBy: `${product.create.firstName} ${product.create.lastName}`,
        updatedBy: `${product.update!.firstName} ${product.update!.lastName}`,
      }));

      if (products.length === 0) {
        return errorMessage(res, 404, "product is empty");
      }

      return successMessage(res, 200, "Products Fetched Successfully", {
        totalProductCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        product: productDataUpdate.map(
          ({ deleted, create, update, ...product }) => product
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async readAllProductUnPaginated(req: Request, res: Response) {
    try {
      const { businessID } = req.user;

      const products = await db.product.findMany({
        where: {
          businessID,
          deleted: false,
          inventory: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          create: true,
          update: true,
        },
      });

      const productDataUpdate = products.map((product) => ({
        ...product,
        createdBy: `${product.create.firstName} ${product.create.lastName}`,
        updatedBy: `${product.update!.firstName} ${product.update!.lastName}`,
      }));

      if (products.length === 0) {
        return errorMessage(res, 404, "product is empty");
      }

      return successMessage(res, 200, "Products Fetched Successfully", {
        product: productDataUpdate.map(
          ({ deleted, create, update, ...product }) => product
        ),
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async updateProduct(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { productId } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "UpdateProduct",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to update a product"
        );
      }

      const product = await db.product.findFirst({
        where: {
          id: Number(productId),
          businessID,
          deleted: false,
          inventory: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          create: true,
        },
      });

      if (!product) {
        return errorMessage(res, 404, "Product not found");
      }

      const { error, value } = validateProductUpdate(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      let photo;
      if (req.file) {
        photo = req.file.path;
      }
      const updatedProductData = {
        ...(value.quantity && { quantity: Number(value.quantity) }),
        ...(value.price && { price: Number(value.price) }),
        ...(value.description && { description: value.description }),
        ...(value.fullDescription && { fullDescription: value.fullDescription }),
        ...(photo && { photo }),
        updatedBy: user!.id,
      };
      
      const updatedProduct = await db.product.update({
        where: { id: product.id },
        data: updatedProductData,
        include: {
          create: true,
        },
      });

      const productUpdatedData = {
        ...updatedProduct,
        createdBy: `${updatedProduct.create.firstName} ${updatedProduct.create.lastName}`,
        updatedBy: `${user!.firstName} ${user!.lastName}`,
      };

      const { deleted, create, ...productData } = productUpdatedData;

      return successMessage(res, 200, "Product item updated successfully", {
        productData,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;
      const { productId } = req.params;

      const user = await db.user.findFirst({
        where: { email },
      });

      const permission = await checkPermission(
        roleName,
        "DeleteProduct",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to delete a product"
        );
      }

      const product = await db.product.findFirst({
        where: { id: Number(productId), businessID, deleted: false },
      });

      if (!product) {
        return errorMessage(res, 404, "Product not found");
      }
      await db.product.update({
        where: { id: Number(productId) },
        data: {
          deleted: true,
          updatedBy: user!.id,
        },
      });

      return successMessage(res, 200, "Product deleted successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }

  public async deletedProduct(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      if (roleName !== "superadmin") {
        return errorMessage(
          res,
          403,
          "You don't have the permission to view deleted inventory"
        );
      }

      const totalProductCount = await db.product.count({
        where: { businessID, deleted: true },
      });

      if (totalProductCount < 1) {
        return errorMessage(res, 404, "No deleted product");
      }

      return successMessage(
        res,
        200,
        "Deleted product(s) count fetched Successfully",
        { totalProductCount }
      );
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
}

const product = new Product();
export default product;
