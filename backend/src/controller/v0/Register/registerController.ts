import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserInterface } from "../../../utils/interfaces";
import redisClient from "../../../utils/redisServer";
import { errorMessage, handleError, successMessage } from "../../../utils/responses";
import { config } from "../config";
import registerProcesses from "./registerProcesses";
import { validateReg } from "./registerSchema";

const db = new PrismaClient();

class Register {
    public async newRegistration(req: Request, res: Response) {
        try {
            const valid = validateReg(req.body);
            if (valid.error) { return errorMessage(res, 403, valid.error.details[0].message) }

            const { user, businessContact, businessData } = req.body;

            const data = await registerProcesses.validateData(user.email, businessContact.email);
            if (data) { return errorMessage(res, 403, data) }

            const hashedPassword = await bcrypt.hash(user.password, 12);

            const businessId = await db.$transaction(async (db) => {
                const createBusiness = await db.business.create({
                    data: {
                        name: businessContact.name,
                        email: businessContact.email,
                        phone: businessContact.phone,
                        industry: businessData.industry,
                        regStatus: businessData.regStatus,
                        size: businessData.size,
                        description: businessData.description
                    }
                });

                const businessId = createBusiness.id;

                await db.businessLocations.create({
                    data: {
                        businessID: businessId,
                        name: "Head office",
                        street: businessContact.address.street,
                        city: businessContact.address.city,
                        state: businessContact.address.state,
                        country: businessContact.address.country,
                        timezone: businessContact.address.timezone
                    }
                });

                const createdRoleID = await registerProcesses.populateDatabase(db, businessId);

                await db.user.create({
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        password: hashedPassword,
                        roleID: createdRoleID,
                        businessID: businessId,
                    }
                });

                return businessId;
            });

            const userInfo: UserInterface = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roleName: "superadmin",
                businessID: businessId
            }

            const accessToken = jwt.sign(userInfo, config.jwt.accessKey, { algorithm: "HS256", expiresIn: "900s" });
            const refreshToken = jwt.sign(userInfo, config.jwt.refreshKey, { algorithm: "HS256", expiresIn: "1d" });
            await redisClient.set(refreshToken, user.email, "EX", 60 * 60 * 24);

            const returnData = {
                access: accessToken,
                refresh: refreshToken,
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roleName: "superadmin",
                    businessID: businessId,
                    businessName: businessContact.name,
                    businessEmail: businessContact.email,
                    businessPhone: businessContact.phone,
                    businessAddress: [businessContact.address]
                }
            }

            return successMessage(res, 201, "Business registered successfully", returnData)
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }
}

const register = new Register();
export default register;