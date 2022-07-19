import { pool } from '../db/db.js';
import logger from '../logger.js';

/**
 * The chicken object
 * @typedef {object} Chicken
 * @property {number} id - The chicken id
 * @property {string} name.required - The name of the chicken
 * @property {number} farmyardID.required - The id of the farmyard related to the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

/**
 * The object used to create a chicken
 * @typedef {object} ChickenCreation
 * @property {string} name.required - The name of the chicken
 * @property {number} farmyardID.required - The id of the farmyard related to the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps=0 - The steps of the chicken
 * @property {boolean} isRunning=false - Whether the chicken is running
 */

/**
 * The object used to patch a chicken
 * @typedef {object} ChickenPatch
 * @property {string} name - The name of the chicken
 * @property {number} farmyardID.required - The id of the farmyard related to the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

function validateChicken(body) {
    if (!body.name || typeof (body.name) !== 'string')
        return false;

    if (!body.farmyardID || typeof (body.farmyardID) !== 'number')
        return false;

    if (!body.weight || typeof (body.weight) !== 'number')
        return false;

    if (body.birthday && ((new Date(body.birthday) === 'Invalid Date') || isNaN(new Date(body.birthday))))
        return false;

    if (body.steps && typeof (body.steps) !== 'number')
        return false;

    if (body.isRunning && typeof (body.isRunning) !== 'boolean')
        return false;

    const allowedFields = ['name', 'birthday', 'weight', 'steps', 'isRunning'];

    for (const field in body) {
        if (!allowedFields.includes(field))
            return false;
    }
    return true;
}

function validatePatch(body) {
    for (const field in body) {
        switch (field) {
        case 'name':
            if (typeof (body.name) !== 'string')
                return false;
            break;
        case 'birthday':
            if ((new Date(body.birthday) === 'Invalid Date') || isNaN(new Date(body.birthday)))
                return false;
            break;
        case 'farmyardID':
            if (typeof (body.farmyardID) !== 'number')
                return false;
            break;
        case 'weight':
            if (typeof (body.weight) !== 'number')
                return false;
            break;
        case 'steps':
            if (typeof (body.steps) !== 'number')
                return false;
            break;
        case 'isRunning':
            if (typeof (body.isRunning) !== 'boolean')
                return false;
            break;
        default:
            return false;
        }
    }

    return true;
}

// TODO - switch sql errors for foreign key errors

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
    if (!validateChicken(chicken)) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    if (!chicken.birthday)
        chicken.birthday = null;
    if (!chicken.steps)
        chicken.steps = 0;
    if (!chicken.isRunning)
        chicken.isRunning = false;

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
    if (!validatePatch(req.body)) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
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
    if (!validateChicken(req.body)) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
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
