/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  errorMessage,
  handleError,
  successMessage,
} from "../../../utils/responses";
import {
  validateUserPasswordUpdate,
  validateUserReg,
  validateUserUpdate,
} from "./userSchema";
import {
  checkPermission,
  generateUserPassword,
  hashPassword,
} from "../../../utils/utilFunctions";
import sendEmail from "../../../utils/email";

const db = new PrismaClient();

class User {
  public async newUser(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "CreateUser",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to create User"
        );
      }

      const { error, value } = validateUserReg(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }
      const password = generateUserPassword();
      const hashedPassword = await hashPassword(password);

      const createdUser = await db.user.create({
        data: {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          password: hashedPassword,
          roleID: Number(value.roleId),
          businessID,
        },
      });

      const { password: userPassword, deactivated, ...userDetails } = createdUser;

      const subject = `Welcome to CruiseWare ${value.firstName}`;
      const message = `Hello ${value.firstName},
      An account has been created for you on our platform.
      To login you will have to login with the following credentials:
      email: ${value.email},
      password: ${password}
      
      Advice: Please change your password on sign in. Thank you.`;

      await sendEmail(value.email, subject, message);

      return successMessage(res, 201, "User Created Successfully", {
        userDetails,
      });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async getAllUsers(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadAllUsers",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read all users"
        );
      }

      const users = await db.user.findMany({
        where: {
          businessID,
        },
      });

      return successMessage(res, 200, "User Fetched Successfully", { users });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async getUser(req: Request, res: Response) {
    try {
      const { businessID } = req.user;
      const { userId } = req.params;

      const user = await db.user.findFirst({
        where: {
          businessID,
          id: userId,
        },
      });

      return successMessage(res, 200, "User Fetched Successfully", { user });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async getUserProfile(req: Request, res: Response) {
    try {
      const { email, roleName, businessID } = req.user;

      const permission = await checkPermission(
        roleName,
        "ReadUser",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to read a user"
        );
      }

      const user = await db.user.findFirst({
        where: {
          businessID,
          email,
        },
      });

      return successMessage(res, 200, "User Profile Fetched Successfully", { user });
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async updateProfile(req: Request, res: Response) {
    try {
      const { email, businessID } = req.user;

      const { error, value } = validateUserUpdate(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      await db.user.update({
        where: { email, businessID },
        data: {
          firstName: value.firstName,
          lastName: value.lastName,
        },
      });

      return successMessage(res, 200, "User Updated Successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async updatePassword(req: Request, res: Response) {
    try {
      const { email, businessID } = req.user;

      const user = await db.user.findFirst({
        where: { email, businessID },
      });
      if (!user) {
        return errorMessage(res, 404, "User not found, Log In");
      }
      const { error, value } = validateUserPasswordUpdate(req.body);
      if (error) {
        return errorMessage(res, 400, error.message);
      }

      if (value.newPassword !== value.retypeNewPassword) {
        return errorMessage(res, 400, "Password Missmatch")
      }

      const passwordMatch = bcrypt.compareSync(
        value.oldPassword,
        user.password
      );
      if (!passwordMatch)
        return errorMessage(res, 400, "Incorrect Old Password");

      const reusePasswordMatch = bcrypt.compareSync(
        value.newPassword,
        user.password
      );
      if (reusePasswordMatch)
        return errorMessage(
          res,
          400,
          "Can not use old password as new password"
        );
      const hashedPassword = await hashPassword(value.newPassword);

      await db.user.update({
        where: { email, businessID },
        data: {
          password: hashedPassword,
        },
      });

      return successMessage(res, 200, "User Password set successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
  public async deactivateUser(req: Request, res: Response) {
    try {
      const { roleName, businessID } = req.user;
      const { userId } = req.params;

      const permission = await checkPermission(
        roleName,
        "DeleteUser",
        businessID
      );
      if (!permission) {
        return errorMessage(
          res,
          403,
          "You do not have permission to deactivate a user"
        );
      }

      await db.user.update({
        where: { id: userId, businessID },
        data: {
          deactivated: true,
        },
      });

      return successMessage(res, 200, "User deactivated successfully");
    } catch (error) {
      handleError(error, req);
      return errorMessage(res, 500, (error as Error).message);
    }
  }
}

const user = new User();
export default user;
