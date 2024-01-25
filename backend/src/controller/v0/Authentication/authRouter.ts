import { Router } from 'express';
import auth from './authController';

const router: Router = Router();


/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The user email
 *                  default: admin@cruiseware.com
 *              password:
 *                  type: string
 *                  description: The user password
 *                  default: admin
 *      SuccessfulLogin:
 *          type: object
 *          required:
 *              - access
 *              - refresh
 *              - data
 *          properties:
 *              access:
 *                  type: string
 *                  description: Access Token
 *                  default: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
 *              refresh:
 *                  type: string
 *                  description: Refresh Token
 *                  default: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
 *              auth:
 *                  type: boolean
 *                  description: Login status
 *                  default: true
 *              data:
 *                  type: object
 *                  properties:
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      email:
 *                          type: string
 *                      roleName:
 *                          type: string
 *                      businessID:
 *                          type: integer
 *                      businessName:
 *                          type: string
 *                      businessEmail:
 *                          type: string
 *                      businessPhone:
 *                          type: string
 *                      businessAddress: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Address'
 *      SuccessfulRefresh:
 *          type: object
 *          required:
 *              - access
 *          properties:
 *              access:
 *                  type: string
 *                  description: Access Token
 *                  default: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
 *              auth:
 *                  type: boolean
 *                  description: Login status
 *                  default: true
 *      LogoutAndRefresh:
 *          type: object
 *          required:
 *              - refreshToken
 *          properties:
 *              refreshToken:
 *                  type: string
 *                  description: The refresh token issued at login or sign up
 *                  default: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
 */


/**
 * @openapi
 * /api/v0/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessfulLogin'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized
 */
router.post('/login', auth.login);


/**
 * @openapi
 * /api/v0/auth/logout:
 *   post:
 *     summary: Logout of the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutAndRefresh'
 *     responses:
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: {}
 */
router.post('/logout', auth.logout);


/**
 * @openapi
 * /api/v0/auth/refresh:
 *   post:
 *     summary: Get a new access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutAndRefresh'
 *     responses:
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 *       403:
 *         description: Forbidden
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessfulRefresh'
 */
router.post('/refresh', auth.refreshToken);


export const AuthRouter: Router = router;