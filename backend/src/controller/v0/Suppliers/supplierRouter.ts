import { Router } from 'express';
import supplier from './supplierController';
import auth from '../Authentication/authController';

const router: Router = Router();

/**
 * @openapi
 * tags:
 *   name: Supplier
 *   description: Managing Suppliers
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      AllSuppliers:
 *          type: object
 *          required:
 *              - message
 *              - data
 *          properties:
 *              message:
 *                  type: string
 *                  description: Message from the server
 *                  default: Suppliers fetched successfully
 *              data:
 *                  type: object
 *                  required:
 *                      - totalSupplierCount
 *                      - currentPage
 *                      - pageSize
 *                      - suppliers
 *                  properties:
 *                      totalSupplierCount:
 *                          type: number
 *                          default: 10
 *                      currentPage:
 *                          type: number
 *                          default: 1
 *                      pageSize:
 *                          type: number
 *                          default: 10
 *                      suppliers:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/SingleSupplier'
 *                          description: An array of the suppliers
 *      SingleSupplier:
 *          type: object
 *          required:
 *              - message
 *              - data
 *          properties:
 *              message:
 *                  type: string
 *                  description: Message from the server
 *                  default: Supplier fetched successfully
 *              data:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                      businessID:
 *                          type: integer
 *                      name:
 *                          type: string
 *                      phone:
 *                          type: string
 *                      email:
 *                          type: string
 *                      address:
 *                          type: string
 *                      contactName:
 *                          type: string
 *                      contactPhone:
 *                          type: string
 *                      contactEmail:
 *                          type: string
 *                      createdAt:
 *                          type: string
 *                      updatedAt:
 *                          type: string
 *                      createdBy:
 *                          type: string
 *                      updatedBy:
 *                          type: string
 *      CreateSupplier:
 *          type: object
 *          required:
 *              - name:
 *              - phone
 *              - address
 *          properties:
 *              name:
 *                  type: string
 *              phone:
 *                  type: string
 *              email:
 *                  type: string
 *              address:
 *                  type: string
 *              contactName:
 *                  type: string
 *              contactPhone:
 *                  type: string
 *              contactEmail:
 *                  type: string
 */


/**
 * @openapi
 * /api/v0/supplier/:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     responses:
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllSuppliers'
 */
router.get('/', auth.auth, supplier.getAllSuppliers);

/**
 * @openapi
 * /api/v0/supplier/{supplierID}/:
 *   get:
 *     summary: Get a supplier
 *     parameters:
 *       - in: path
 *         name: supplierID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier ID
 *     tags: [Supplier]
 *     responses:
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleSupplier'
 */
router.get('/:supplierID', auth.auth, supplier.getSupplier);

/**
 * @openapi
 * /api/v0/supplier/:
 *   post:
 *     summary: Create a supplier
 *     tags: [Supplier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplier'
 *     responses:
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleSupplier'
 */
router.post('/', auth.auth, supplier.createSupplier);

router.put('/:supplierID', auth.auth, supplier.updateSupplier);

/**
 * @openapi
 * /api/v0/supplier/{supplierID}/:
 *   delete:
 *     summary: Delete a supplier
 *     parameters:
 *       - in: path
 *         name: supplierID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier ID
 *     tags: [Supplier]
 *     responses:
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: {}
 */
router.delete('/:supplierID', auth.auth, supplier.deleteSupplier);

export const SupplierRouter: Router = router;