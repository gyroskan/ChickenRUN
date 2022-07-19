import { pool } from '../db/db.js';
import logger from '../logger.js';

/**
 * The chicken object
 * @typedef {object} Chicken
 * @property {number} id - The chicken id
 * @property {string} name.required - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

/**
 * The object used to create a chicken
 * @typedef {object} ChickenCreation
 * @property {string} name.required - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps=0 - The steps of the chicken
 * @property {boolean} isRunning=false - Whether the chicken is running
 */

/**
 * The object used to patch a chicken
 * @typedef {object} ChickenPatch
 * @property {string} name - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getChickens(req, res) {
    try {
        const chickens = await pool.query('SELECT * FROM `chicken`');
        res.status(200).json(chickens);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error('Error while getting chickens', err);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getChicken(req, res) {
    try {
        const chicken = await pool.query('SELECT * FROM `chicken` WHERE `id` = ?', [req.params.id]);
        if (chicken.length === 0)
            res.status(404).json({ error: 'Not found' });
        else
            res.status(200).json(chicken[0]);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error('Error while getting chicken', err);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createChicken(req, res) {
    const chicken = req.body;
    if (!chicken.birthday)
        chicken.birthday = null;
    if (!chicken.steps)
        chicken.steps = 0;
    if (!chicken.isRunning)
        chicken.isRunning = false;

    // FIXME: validate fields
    const insert = 'INSERT INTO `chicken` (`name`, `birthday`, `weight`, `steps`, `isRunning`) VALUES (?, ?, ?, ?, ?)';
    try {
        const result = await pool.query(insert,
            [chicken.name, chicken.birthday, chicken.weight, chicken.steps, chicken.isRunning]);

        chicken.id = result.insertId;
        res.status(201).json(chicken);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error('Error while creating chicken', err);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateChicken(req, res) {
    // TODO validate fields

    const fields = req.body;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function replaceChicken(req, res) {
    res.send('replace chicken');
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteChicken(req, res) {
    res.send('delete chicken');
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function chickenRun(req, res) {
    res.send('chicken run');
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function chickenStop(req, res) {
    res.send('chicken stop');
}
