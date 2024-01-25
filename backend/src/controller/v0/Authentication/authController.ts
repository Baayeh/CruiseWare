/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../../../utils/redisServer";
import { UserInterface } from "../../../utils/interfaces";
import { config } from "../config";
import { PrismaClient } from "@prisma/client";
import { validateLogin } from "./authenticationSchema";
import { errorMessage } from "../../../utils/responses";

const db = new PrismaClient();

class Auth {
  public async login(req: Request, res: Response) {
    try {
      const valid = validateLogin(req.body);
      if (valid.error) {
        return res.status(400).json({ error: valid.error.message });
      }

      const { email, password } = req.body;
      const user = await db.user.findUnique({
        where: {
          email: email,
        },
        include: {
          role: {
            select: {
              name: true,
            },
          },
          business: {
            include: {
              businessLocations: {
                select: {
                  street: true,
                  city: true,
                  state: true,
                  country: true,
                  timezone: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return res.status(404).json({
          auth: false,
          message: "User not found",
        });
      }
      if (user.deactivated == true) {
        return errorMessage(
          res,
          403,
          "Your account has been deactivated, contact your admin"
        );
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(401)
          .send({ auth: false, message: "Password is incorrect" });
      }

      const userData: UserInterface = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleName: user.role.name,
        businessID: user.businessID,
      };

      const accessToken = jwt.sign(userData, config.jwt.accessKey, {
        algorithm: "HS256",
        expiresIn: "900s",
      });
      const refreshToken = jwt.sign(userData, config.jwt.refreshKey, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
      await redisClient.set(
        refreshToken,
        email,
        "EX",
        60 * 60 * 24,
        (error, result) => {
          if (error) {
            console.error("Error saving key to Redis:", error);
            return res.sendStatus(500);
          } else {
            if (result === "OK") {
              return res.status(200).json({
                auth: true,
                access: accessToken,
                refresh: refreshToken,
                data: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  roleName: user.role.name,
                  businessID: user.businessID,
                  businessName: user.business.name,
                  businessEmail: user.business.email,
                  businessPhone: user.business.phone,
                  businessAddress: user.business.businessLocations,
                },
              });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh Token provided." });
      }

      redisClient.del(refreshToken, (error, result) => {
        if (error) {
          console.error("Error deleting key from Redis:", error);
          return res.sendStatus(500);
        } else {
          if (result === 1) {
            return res.status(200).json({ message: "Logout successful." });
          } else {
            return res
              .status(404)
              .send({ auth: false, message: "Invalid refresh token" });
          }
        }
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  public async auth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.sendStatus(401);
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, config.jwt.accessKey, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  public async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(400).send({ message: "refreshToken is required" });
      }

      const email = await redisClient.get(refreshToken);
      if (!email) {
        return res
          .status(404)
          .send({ message: "refresh token not recognised" });
      }

      jwt.verify(
        refreshToken,
        config.jwt.refreshKey,
        (err: any, decoded: any) => {
          if (err || email !== decoded.email) return res.sendStatus(403);

          const userData: UserInterface = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            roleName: decoded.roleName,
            businessID: decoded.businessID,
          };

          const accessToken = jwt.sign(userData, config.jwt.accessKey, {
            algorithm: "HS256",
            expiresIn: "900s",
          });

          res.status(200).json({
            auth: true,
            access: accessToken,
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

const auth = new Auth();
export default auth;
