import * as mariadb from 'mariadb';
import logger from '../logger.js';

/**
 * @type {mariadb.Pool}
 */
export let pool;

const chickenTableCreate = `CREATE TABLE IF NOT EXISTS chicken (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    birthday DATE,
    weight INT NOT NULL,
    steps INT NOT NULL DEFAULT 0,
    isRunning BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (id)
)`;

export async function setupDatabase() {
    let connection;
    try {
        connection = await mariadb.createConnection({
            host:     process.env.DB_HOST,
            user:     process.env.DB_USER,
            password: process.env.DB_PWD,
        });

        let result = await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        if (result.affectedRows === 1)
            logger.info(`Database '${process.env.DB_NAME}' created`);

        pool = mariadb.createPool({
            host:     process.env.DB_HOST,
            user:     process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME,
        });

        result = await pool.query(chickenTableCreate);
        if (result.warningStatus === 0)
            logger.info("Table 'chicken' created");

        return undefined;
    }
    catch (err) {
        return err;
    }
    finally {
        if (connection)
            connection.end();
    }
}
