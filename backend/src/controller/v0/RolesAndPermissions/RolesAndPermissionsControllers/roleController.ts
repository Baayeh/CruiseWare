import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import { UpdateData, UserInterface } from "../../../../utils/interfaces";
import { errorMessage, handleError, successMessage } from "../../../../utils/responses";
import { checkPermission } from "../../../../utils/utilFunctions";
import { validatePermissionsList } from "../roleSchema";


const db = new PrismaClient();


class RoleController {
    // Get all roles
    async getAllRoles(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadAllRoles", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch all roles");
            }

            const roles: Role[] = await db.role.findMany({ where: { businessID: userData.businessID, deleted: false } });

            const transformedRoles = roles.map(({ deleted: deletedProp, businessID, ...roleData }) => roleData);

            return successMessage(res, 200, "Roles fetched successfully", transformedRoles);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Get a single role
    async getRole(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadRole", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to fetch a role");
            }

            const { roleName } = req.params;

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, "Role not found");
            }

            const { deleted: deletedProp, businessID, ...roleData } = role;

            return successMessage(res, 200, "Role fetched successfully", roleData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Create a new role
    async createRole(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "CreateRole", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to create a role");
            }

            const { roleName, roleDescription } = req.body;
            if (!roleName || !roleDescription) {
                return errorMessage(res, 400, "roleName and roleDescription are required");
            }

            const existingRole = await db.role.findFirst({
                where: { name: roleName, businessID: userData.businessID, deleted: false }
            });
            if (existingRole) { return errorMessage(res, 400, `A role with the name ${roleName} already exists`); }

            const role = await db.role.create({
                data: {
                    name: roleName,
                    description: roleDescription,
                    businessID: userData.businessID
                }
            })

            const { deleted, businessID, ...roleData } = role;

            return successMessage(res, 201, "Role created successfully", roleData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Delete a role
    async deleteRole(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "DeleteRole", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to delete a role");
            }

            const { roleName } = req.params;

            if (roleName === "superadmin") {
                return errorMessage(res, 403, `The role ${roleName} can not be deleted`);
            } else if (roleName === "admin" && userData.roleName !== "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to delete this role");
            }

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, `Role with name ${roleName} not found`);
            }

            const rolePermissions = await db.rolePermission.findMany({ where: { roleId: role.id, businessID: userData.businessID } });
            if (rolePermissions.length > 0) {
                await db.rolePermission.deleteMany({
                    where: {
                        roleId: role.id,
                        businessID: userData.businessID
                    },
                });
            }

            await db.role.update({
                where: { id: role.id },
                data: {
                    deleted: true
                }
            });

            return successMessage(res, 200, "Role deleted successfully");
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Update a role
    async updateRole(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateRole", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update a role");
            };

            const { roleName } = req.params;
            if (roleName === "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            } else if (roleName === "admin" && userData.roleName !== "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            }

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, `Role with name ${roleName} not found`);
            }

            const { name, description } = req.body;

            const data: UpdateData = {};

            if (name) {
                if (name !== roleName) {
                    const existingRole = await db.role.findFirst({
                        where: { name: name, businessID: userData.businessID, deleted: false }
                    });

                    if (existingRole) {
                        return errorMessage(res, 400, `A role with the name ${name} already exists`);
                    } else {
                        data.name = name;
                    }
                } else {
                    data.name = name;
                }
            }

            if (description) {
                data.description = description;
            }

            const updatedRole = await db.role.update({
                where: { id: role.id },
                data,
            })

            const { deleted, businessID, ...roleData } = updatedRole;

            return successMessage(res, 200, "Role updated successfully", roleData);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Get all permissions in a role
    async getRolePermissions(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const { roleName } = req.params;

            if (roleName !== userData.roleName) {
                const permission = await checkPermission(userData.roleName, "ReadRole", userData.businessID);
                if (!permission) {
                    return errorMessage(res, 403, "You don't have the permission to fetch a role's data");
                }
            }

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, `Role with name ${roleName} not found`);
            }

            const rolePermissions = await db.rolePermission.findMany({
                where: { roleId: role.id, businessID: userData.businessID },
                include: { permission: true }
            })
            if (!rolePermissions) {
                return successMessage(res, 200, `Role with name ${roleName} has no attached permissions`);
            }

            const transformedrolePermissions = rolePermissions.map((permissionData) => {
                const { permissionId, permission } = permissionData;

                const { name: permissionName, description: permissionDescription } = permission

                const newPermission = {
                    permissionId: permissionId,
                    permissionName: permissionName,
                    permissionDescription: permissionDescription
                }

                return newPermission;
            })

            return successMessage(res, 200, "Role permissions fetched successfully", transformedrolePermissions);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Add a permission to a role
    async addRolePermissions(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const checkpermission = await checkPermission(userData.roleName, "UpdateRole", userData.businessID);
            if (!checkpermission) {
                return errorMessage(res, 403, "You don't have the permission to update a role");
            }

            const { roleName } = req.params;

            if (roleName === "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            } else if (roleName === "admin" && userData.roleName !== "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            }

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, `Role with name ${roleName} not found`);
            }

            const { error, value } = validatePermissionsList(req.body);
            if (error) { return errorMessage(res, 400, error.message); }

            const permissionIDs: number[] = [];

            console.log(value)

            for (const permissionName of value.permissions) {
                const permission = await db.permission.findFirst({ where: { name: permissionName, businessID: userData.businessID } });
                if (!permission) {
                    return errorMessage(res, 404, `Permission with name ${permissionName} not found`);
                }

                const rolePermission = await db.rolePermission.findFirst({
                    where: {
                        roleId: role.id,
                        permissionId: permission.id,
                        businessID: userData.businessID
                    }
                })
                if (!rolePermission) {
                    permissionIDs.push(permission.id);
                };
            }

            if (permissionIDs.length === 0) { return errorMessage(res, 404, "No new permissions added") }

            permissionIDs.forEach(async (number) => {
                await db.rolePermission.create({
                    data: {
                        roleId: role.id,
                        businessID: userData.businessID,
                        permissionId: number
                    }
                });
            });


            return successMessage(res, 200, "Permissions added successfully");
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Remove a permission from a role
    async removeRolePermission(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const checkpermission = await checkPermission(userData.roleName, "UpdateRole", userData.businessID);
            if (!checkpermission) {
                return errorMessage(res, 403, "You don't have the permission to update a role");
            }

            const { roleName, permissionName } = req.params;

            if (roleName === "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            } else if (roleName === "admin" && userData.roleName !== "superadmin") {
                return errorMessage(res, 403, "You don't have the permission to update this role");
            }

            const role = await db.role.findFirst({ where: { name: roleName, businessID: userData.businessID, deleted: false } });
            if (!role) {
                return errorMessage(res, 404, `Role with name ${roleName} not found`);
            }

            const permission = await db.permission.findFirst({ where: { name: permissionName, businessID: userData.businessID } });
            if (!permission) {
                return errorMessage(res, 404, `Permission with name ${permissionName} not found`);
            }

            const rolePermission = await db.rolePermission.findFirst({
                where: {
                    roleId: role.id,
                    permissionId: permission.id,
                    businessID: userData.businessID
                }
            })
            if (!rolePermission) {
                return errorMessage(res, 403, `Role with name: ${roleName} does not have permission: ${permissionName}`);
            };

            await db.rolePermission.delete({ where: { id: rolePermission.id } });

            return successMessage(res, 200, "Permission removed successfully");
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

}

const roleController = new RoleController();

export default roleController;