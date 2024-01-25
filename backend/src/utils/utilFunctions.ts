import crypto from "crypto";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";


const db = new PrismaClient();


// Generate a secret
export function generateSecret(length: number) {
  return crypto.randomBytes(length).toString("hex");
};

// Checks if a roleName has a permissionName attached to it.
// roleName is fetched from req.user
// permissionName is read from the permissions array in src/utils/register_default_data 
//  If the correct permission is not in the above file, please create it
export async function checkPermission(roleName: string, permissionName: string, businessId: number) {
  const result = await db.$transaction(async (db) => {
    const role = await db.role.findFirst({ where: { name: roleName, businessID: businessId } });
    const permission = await db.permission.findFirst({ where: { name: permissionName, businessID: businessId } });

    const data = await db.rolePermission.findFirst({ where: { roleId: role?.id, permissionId: permission?.id, businessID: businessId } });

    return data
  })

  if (result) {
    return true;
  }
  return false;
}

// Get the full names of the users given their userIDs
// To be used to update the 'createdBy' and 'updatedBy' fields of data
export async function getFullNames(createdBy: string, updatedBy: string) {
  const users = await db.$transaction(async (db) => {
    const userCreate = await db.user.findUnique({ where: { id: createdBy } });
    const userUpdate = await db.user.findUnique({ where: { id: updatedBy } });

    const createName: string = `${userCreate?.firstName} ${userCreate?.lastName}`;
    const updateName: string = `${userUpdate?.firstName} ${userUpdate?.lastName}`;

    return { createName, updateName }
  });

  return users;
}

export const generateReference = (length = 5) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `CRUISE-ID-${result}-${DateTime.now().toMillis()}`;
};


export const generateUserPassword = (): string => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const numbers = "0123456789";
  const allCharacters = uppercaseLetters + lowercaseLetters + specialCharacters + numbers;
  let randomPassword = "";
  const length = 10;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    randomPassword += allCharacters[randomIndex];
  }

  return randomPassword;
}

export const hashPassword = async (password: string) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}
