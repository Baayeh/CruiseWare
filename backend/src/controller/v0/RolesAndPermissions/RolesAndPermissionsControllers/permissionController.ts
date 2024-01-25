import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { checkPermission } from "../../../../utils/utilFunctions";
import { errorMessage, successMessage, handleError } from "../../../../utils/responses";
import { UserInterface } from "../../../../utils/interfaces";

const db = new PrismaClient();

class PermissionController {
    // Get all permissions
    async getAllPermissions(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadAllPermissions", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch all permissions.");
            }

            const permissions = await db.permission.findMany({ where: { businessID: userData.businessID } });
            const transformedpermissions = permissions.map(({ id, businessID, ...permissionData }) => permissionData);

            return successMessage(res, 200, "Permissions fetched successfully", transformedpermissions);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }
}

const permissionController = new PermissionController();

export default permissionController;