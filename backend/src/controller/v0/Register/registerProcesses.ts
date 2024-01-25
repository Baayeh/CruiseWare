import { PrismaClient } from "@prisma/client";
import {
  permissions,
  rolePermissions,
  roles,
} from "../../../utils/register_default_data";

const db = new PrismaClient();

class RegisterProcesses {
  // Ensure business email and user email are unique
  public async validateData(userEmail: string, businessEmail: string) {
    const [existingUser, existingBusiness] = await db.$transaction(
      async (db) => {
        const existingUser = await db.user.findUnique({
          where: { email: userEmail },
        });
        const existingBusiness = await db.business.findUnique({
          where: { email: businessEmail },
        });

        return [existingUser, existingBusiness];
      }
    );

    if (existingUser && existingBusiness) {
      // Both existingUser and existingBusiness are not null

      return "Both user email and business email already exist.";
    } else if (!existingUser && existingBusiness) {
      // existingUser is null but existingBusiness is valid

      return "Business email already exists";
    } else if (existingUser && !existingBusiness) {
      // existingBusiness is null but existingUser is valid

      return "User email already exists";
    }
  }

  // Populate default data for the business
  // DBase is an instance of PrismaClient()
  // DBase is passed in because this method is used within a Prisma transaction and must continue the transaction
  public async populateDatabase(DBase: any, businessId: number) {
    // Handle roles
    const createdRoleIds = await Promise.all(
      roles.map(async (role) => {
        role.businessID = businessId;
        if (role.name === "superadmin") {
          const createdRole = await DBase.role.create({ data: role });
          return createdRole.id;
        }
        await DBase.role.create({ data: role });
      })
    );

    // Handle permissions
    permissions.forEach(async (permission) => {
      permission.businessID = businessId;
      await DBase.permission.create({ data: permission });
    });

    // Handle rolePermissions
    await Promise.all(
      rolePermissions.map(async (rolePermission) => {
        const role = await DBase.role.findFirst({
          where: { name: rolePermission.roleName, businessID: businessId },
        });

        if (role) {
          const permission = await DBase.permission.findMany({
            where: { businessID: businessId },
          });
          const permissionIds = permission
            .filter((p: { name: string }) =>
              rolePermission.permissionNames.includes(p.name)
            )
            .map((p: { id: any }) => p.id);

          await DBase.rolePermission.createMany({
            data: permissionIds.map((permissionId: any) => ({
              roleId: role.id,
              permissionId: permissionId,
              businessID: businessId,
            })),
          });
        }
      })
    );

    return createdRoleIds[0];
  }
}

const registerProcesses = new RegisterProcesses();
export default registerProcesses;
