import express from 'express';
import pino from 'express-pino-logger';
import logger from './logger.js';
// load .env values
import { config } from 'dotenv';
config();

if (!process.env.PORT || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PWD || !process.env.DB_USER) {
    logger.fatal('Missing environment variables. Make sure to provide PORT, DB_HOST, DB_NAME, DB_PWD and DB_USER.');
    process.exit(1);
}


const app = express();

app.use(pino({ logger: logger }));

// FIXME: Use routes here


app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});
