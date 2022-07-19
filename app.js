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

import { router as chickenRouter } from './routes/chicken.js';

const app = express();

app.use(express.json());
app.use(pino({ logger: logger }));

// FIXME: Use routes here

app.use('/chicken', chickenRouter);


app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});
