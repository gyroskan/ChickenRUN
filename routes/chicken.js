import * as chicken from '../controllers/chicken.js'; '../controllers/chicken.js';
import { Router } from 'express';

/**
 * The chicken object
 * @typedef {import('../controllers/chicken.js').Chicken} Chicken
 */

/**
 * The object used to create a chicken
 * @typedef {import('../controllers/chicken.js').ChickenCreation} ChickenCreation
 */

/**
 * The object used to patch a chicken
 * @typedef {import('../controllers/chicken.js').ChickenPatch} ChickenPatch
 */

export const router = Router();

/**
 * GET /chicken
 * @description Get all the existing chickens
 * @tags chicken
 * @return {Array<Chicken>} 200 - Success
 */
router.get('/', chicken.getChickens);

/**
 * GET /chicken/:id
 * @description Get a chicken by its id
 * @tags chicken
 * @param {number} id.path.required - The id of the chicken
 * @return {Chicken} 200 - Success
 * @return {object} 404 - Not Found
 */
router.get('/:id', chicken.getChicken);

/**
 * POST /chicken
 * @description Create a new chicken
 * @tags chicken
 * @param {ChickenCreation} request.body.required - The chicken to create - application/json
 * @return {Chicken} 201 - Created
 * @return {object} 400 - Bad Request
 */
router.post('/', chicken.createChicken);

/**
 * PATCH /chicken/:id
 * @description Update some fields of a chicken
 * @tags chicken
 * @param {number} id.path.required - The id of the chicken
 * @param {ChickenPatch} request.body.required - The fields to update - application/json
 * @return {Chicken} 200 - Success
 * @return {object} 400 - Bad Request
 * @return {object} 404 - Not Found
 */
router.patch('/:id', chicken.updateChicken);

/**
 * PUT /chicken/:id
 * @description Replace a chicken
 * @tags chicken
 * @param {number} id.path.required - The id of the chicken
 * @param {ChickenCreation} request.body.required - The chicken to replace - application/json
 * @return {Chicken} 200 - Success
 * @return {object} 400 - Bad Request
 * @return {object} 404 - Not Found
 */
router.put('/:id', chicken.replaceChicken);

/**
 * DELETE /chicken/:id
 * @description Delete a chicken
 * @tags chicken
 * @param {number} id.path.required - The id of the chicken
 * @return {object} 204 - No Content
 * @return {object} 404 - Not Found
 */
router.delete('/:id', chicken.deleteChicken);

/**
 * POST /chicken/:id/run
 * @description Increase the steps of the chicken by 1
 * @tags chicken
 * @param {number} id.path.required - The id of the chicken
 * @return {Chicken} 200 - Success
 * @return {object} 404 - Not Found
 */
router.post('/:id/run', chicken.chickenRun);
