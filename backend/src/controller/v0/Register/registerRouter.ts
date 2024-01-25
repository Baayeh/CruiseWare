import { Router } from "express";
import register from "./registerController";

const router: Router = Router();


/**
 * @openapi
 * tags:
 *   name: Register
 *   description: New Registration Endpoints
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      NewRegistration:
 *          type: object
 *          required:
 *              - user
 *              - businessContact
 *              - businessData
 *          properties:
 *              user:
 *                  $ref: '#/components/schemas/User'
 *              businessContact:
 *                  $ref: '#/components/schemas/BusinessContact'
 *              businessData:
 *                  $ref: '#/components/schemas/BusinessData'
 *      User:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *          properties:
 *              firstName:
 *                  type: string
 *                  default: FirstName
 *              lastName:
 *                  type: string
 *                  default: LastName
 *              email:
 *                  type: string
 *                  format: email
 *                  default: admin@cruiseware.com
 *              password:
 *                  type: string
 *                  format: password
 *                  default: admin
 *      BusinessContact:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - phone
 *              - address
 *          properties:
 *              name:
 *                  type: string
 *                  default: Cruise
 *              email:
 *                  type: string
 *                  format: email
 *                  default: user@businessname.com
 *              phone:
 *                  type: string
 *                  default: +2349012345678
 *              address:
 *                  $ref: '#/components/schemas/Address'
 *      BusinessData:
 *          type: object
 *          required:
 *              - industry
 *              - regStatus
 *              - size
 *              - description
 *          properties:
 *              industry:
 *                  type: string
 *                  description: the name of the industry the business operates in
 *                  default: Retail
 *              regStatus:
 *                  type: boolean
 *                  description: whether or not the business is registered
 *                  default: false
 *              size:
 *                  type: string
 *                  description: the size of the business.
 *                  enum:
 *                      - sole_Proprietorship
 *                      - small
 *                      - medium
 *                      - large
 *                      - enterprise
 *                  default: small
 *              description:
 *                  type: string
 *                  description: a short description of the business
 *                  default: A small retail business
 *      Address:
 *          type: object
 *          required:
 *              - street
 *              - city
 *              - state
 *              - country
 *              - timezone
 *          properties:
 *              street:
 *                  type: string
 *                  default: 28, Eric Moore rd
 *              city:
 *                  type: string
 *                  default: Surulere
 *              state:
 *                  type: string
 *                  default: Lagos
 *              country:
 *                  type: string
 *                  default: Nigeria
 *              timezone:
 *                  type: string
 *                  default: Africa/Lagos
 */


/**
 * @openapi
 * /api/v0/register/:
 *   post:
 *     summary: Register a new business
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRegistration'
 *     responses:
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessfulLogin'
 */
router.post('/', register.newRegistration);

export const RegisterRouter: Router = router;