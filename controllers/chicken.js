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
        logger.error(err, 'Error while getting chickens');
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
        logger.error(err, 'Error while getting chicken');
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

        chicken.id = Number(result.insertId);
        res.status(201).json(chicken);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while creating chicken');
    }
}

function buildUpdate(body) {
    let update = 'UPDATE `chicken` SET ';
    const values = [];
    for (const field in body) {
        update += `${field} = ?, `;
        values.push(body[field]);
    }

    update = update.substring(0, update.length - 2) + ' WHERE `id` = ?';
    return { update, values };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateChicken(req, res) {
    // TODO validate fields
    const { update, values } = buildUpdate(req.body);
    try {
        const result = await pool.query(update, [...values, req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Not found' });
        }
        else {
            const chicken = await pool.query('SELECT * FROM `chicken` WHERE `id` = ?', [req.params.id]);
            res.status(200).json(chicken);
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while updating chicken');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export function replaceChicken(req, res) {
    updateChicken(req, res);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteChicken(req, res) {
    try {
        const result = await pool.query('DELETE FROM `chicken` WHERE `id` = ?', [req.params.id]);
        if (result.affectedRows === 0)
            res.status(404).json({ error: 'Not found' });

        else
            res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while deleting chicken');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function chickenRun(req, res) {
    const updateStep = 'UPDATE `chicken` SET `steps` = `steps` + 1, `isRunning` = true WHERE `id` = ?';
    try {
        const result = await pool.query(updateStep, [req.params.id]);
        if (result.affectedRows === 0)
            res.status(404).json({ error: 'Not found' });
        else
            res.status(200).end();
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while updating steps of chicken');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function chickenStop(req, res) {
    const stopChicken = 'UPDATE `chicken` SET `isRunning` = false WHERE `id` = ?';
    try {
        const result = await pool.query(stopChicken, [req.params.id]);
        if (result.affectedRows === 0)
            res.status(404).json({ error: 'Not found' });
        else
            res.status(200).end();
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while updating stop of chicken');
    }
}
