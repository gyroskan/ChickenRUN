import { pool } from '../db/db.js';
import logger from '../logger.js';

/**
 * The FarmYard object
 * @typedef {object} Farmyard
 * @property {number} id - The farmyard id
 * @property {string} name.required - The name of the farmyard
 */

/**
 * The object used to create a farmyard
 * @typedef {object} FarmyardCreation
 * @property {string} name.required - The name of the farmyard
 */

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getFarmyards(req, res) {
    try {
        const farmyards = await pool.query('SELECT * FROM `farmyard`');
        res.status(200).json(farmyards);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while getting farmyards');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getFarmyard(req, res) {
    try {
        const farmyard = await pool.query('SELECT * FROM `farmyard` WHERE `id` = ?', [req.params.id]);
        if (farmyard.length === 0)
            res.status(404).json({ error: 'Not found' });
        else
            res.status(200).json(farmyard[0]);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while getting farmyard');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createFarmyard(req, res) {
    if (!req.body.name || typeof req.body.name !== 'string')
        return res.status(400).json({ error: 'Bad Request' });

    try {
        const farmyard = await pool.query('INSERT INTO `farmyard` (`name`) values (?)', req.body.name);
        res.status(201).json(farmyard[0]);
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while creating farmyard');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteFarmyard(req, res) {
    try {
        const farmyard = await pool.query('DELETE FROM `farmyard` WHERE `id` = ?', [req.params.id]);
        if (farmyard.length === 0)
            res.status(404).json({ error: 'Not found' });
        else
            res.status(204).end();
    }
    catch (err) {
        // could also provide the error in the response
        res.status(500).json({ error: 'Server error' });
        logger.error(err, 'Error while deleting farmyard');
    }
}
