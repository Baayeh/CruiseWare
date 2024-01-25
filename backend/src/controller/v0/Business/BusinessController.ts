import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { UserInterface } from "../../../utils/interfaces";
import { errorMessage, handleError, successMessage } from "../../../utils/responses";
import { checkPermission } from "../../../utils/utilFunctions";
import {
    validateBusinessUpdate,
    validateCreateHours,
    validateCreateLocations,
    validateCreateSocials,
    validateData,
    validateHours,
    validateLocations,
    validateSocials
} from "./BusinessSchema";

const db = new PrismaClient();

class Business {
    // Get business data
    public async getBusinessData(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "ReadBusinessData", userData.businessID);
            if (!permission) {
                return res.status(403).json({
                    message: "You don't have the permission to fetch business data"
                });
            }

            const business = await db.business.findUnique({
                where: { id: userData.businessID },
                include: {
                    businessSocials: true,
                    businessLocations: {
                        include: { businessHours: true }
                    }
                }
            })
            if (!business) {
                return res.status(404).json({
                    message: "Business not found"
                });
            }

            return res.status(200).json({
                message: "Business data fetched successfully",
                businessData: business
            });
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    };

    // Create business Hours
    public async createHours(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateBusinessData", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update business data");
            }

            const { error, value } = validateCreateHours(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const hours = await db.businessHours.create({
                data: {
                    businessID: value.businessID,
                    locationID: value.locationID,
                    day: value.day,
                    start: value.start,
                    end: value.end
                }
            })

            return successMessage(res, 200, "Business Hours Added Successfully", hours);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Create business Socials
    public async createSocials(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateBusinessData", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update business data");
            }

            const { error, value } = validateCreateSocials(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const socials = await db.businessSocials.create({
                data: value
            })

            return successMessage(res, 200, "Business Socials Added Successfully", socials);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Create business Locations
    public async createLocations(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateBusinessData", userData.businessID);
            if (!permission) {
                return errorMessage(res, 403, "You don't have the permission to update business data");
            }

            const { error, value } = validateCreateLocations(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const location = await db.businessLocations.create({
                data: value
            })

            return successMessage(res, 200, "Business Location Added Successfully", location);
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    }

    // Update business data
    public async updateBusinessData(req: Request, res: Response) {
        try {
            const userData: UserInterface = req.user;

            const permission = await checkPermission(userData.roleName, "UpdateBusinessData", userData.businessID);
            if (!permission) {
                return res.status(403).json({
                    message: "You don't have the permission to update business data"
                });
            }

            const business = await db.business.findUnique({ where: { id: userData.businessID } })
            if (!business) {
                return res.status(404).json({
                    message: "Business not found"
                });
            }

            // Only one of 4 possible data: businessData, businessSocials, businessLocations, businessHours
            const { error } = validateBusinessUpdate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { businessData, businessSocials, businessLocations, businessHours } = req.body;
            if (businessLocations) {
                const { error, value } = validateLocations(businessLocations);

                if (error) {
                    return res.status(400).json({ error: error.details[0].message });
                }

                const updatedData = await db.businessLocations.update({
                    where: { id: businessLocations.id },
                    data: value,
                });

                if (updatedData) {
                    return res.status(200).json({
                        message: "Location data saved successfully",
                        data: updatedData
                    });
                } else { return res.status(500).json({ error: "error updating database" }) }
            } else if (businessData) {
                const { error, value } = validateData(businessData);

                if (error) {
                    return res.status(400).json({ error: error.details[0].message });
                }

                const updatedData = await db.business.update({
                    where: { id: businessData.id },
                    data: value,
                })

                if (updatedData) {
                    return res.status(200).json({
                        message: "Business data saved successfully",
                        data: updatedData
                    });
                } else { return res.status(500).json({ error: "error updating database" }) }
            } else if (businessSocials) {
                const { error, value } = validateSocials(businessSocials);

                if (error) {
                    return res.status(400).json({ error: error.details[0].message });
                }

                const updatedData = await db.businessSocials.update({
                    where: { id: businessSocials.id },
                    data: value,
                })

                if (updatedData) {
                    return res.status(200).json({
                        message: "Socials data updated successfully",
                        data: updatedData
                    });
                } else { return res.status(500).json({ error: "error updating database" }) }
            } else if (businessHours) {
                const { error, value } = validateHours(businessHours);

                if (error) {
                    return res.status(400).json({ error: error.details[0].message });
                }

                const updatedData = await db.businessHours.update({
                    where: { id: businessHours.id },
                    data: value,
                })

                if (updatedData) {
                    return res.status(200).json({
                        message: "Hours data updated successfully",
                        data: updatedData
                    });
                } else { return res.status(500).json({ error: "error updating database" }) }
            }
        } catch (error) {
            handleError(error, req);
            return errorMessage(res, 500, "Internal Server Error");
        }
    };
}

const business = new Business();
export default business;