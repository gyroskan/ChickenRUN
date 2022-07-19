import * as farmyard from '../controllers/farmYard.js';
import { Router } from 'express';

/**
 * The farmyard object
 * @typedef {import('../controllers/farmYard.js').Farmyard} Farmyard
 */

/**
 * The object used to create a farmyard
 * @typedef {import('../controllers/farmYard.js').FarmyardCreation} FarmyardCreation
 */

export const router = Router();

/**
 * GET /farmyard
 * @description Get all the existing farmyards
 * @tags farmyard
 * @return {Array<farmyard>} 200 - Success
 */
router.get('/', farmyard.getFarmyards);

/**
 * GET /farmyard/:id
 * @description Get a farmyard by its id
 * @tags farmyard
 * @param {number} id.path.required - The id of the farmyard
 * @return {farmyard} 200 - Success
 * @return {object} 404 - Not Found
 */
router.get('/:id', farmyard.getFarmyard);

/**
 * POST /farmyard
 * @description Create a new farmyard
 * @tags farmyard
 * @param {farmyardCreation} request.body.required - The farmyard to create - application/json
 * @return {farmyard} 201 - Created
 * @return {object} 400 - Bad Request
 */
router.post('/', farmyard.createFarmyard);

/**
 * DELETE /farmyard/:id
 * @description Delete a farmyard
 * @tags farmyard
 * @param {number} id.path.required - The id of the farmyard
 * @return {object} 204 - No Content
 * @return {object} 404 - Not Found
 */
router.delete('/:id', farmyard.deleteFarmyard);
