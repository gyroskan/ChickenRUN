import express from 'express';
import pino from 'express-pino-logger';
import logger from './logger.js';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { config } from 'dotenv';
config();

if (!process.env.PORT || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PWD || !process.env.DB_USER) {
    logger.fatal('Missing environment variables. Make sure to provide PORT, DB_HOST, DB_NAME, DB_PWD and DB_USER.');
    process.exit(1);
}

import { setupDatabase } from './db/db.js';
const err = await setupDatabase();
if (err !== undefined) {
    logger.fatal(err, 'Failed to setup the database');
    process.exit(2);
}

const app = express();

const docOptions = {
    info: {
        version: '1.0.0',
        title:   'Chicken RUN',
        license: { name: 'MIT' },
    },
    security: {
        BasicAuth: {
            type:   'http',
            scheme: 'basic',
        },
    },
    baseDir:         './',
    filesPattern:    './**/*.js',
    swaggerUIPath:   '/docs',
    exposeSwaggerUI: true,
    exposeApiDocs:   false,
};
expressJSDocSwagger(app)(docOptions);

import { router as chickenRouter } from './routes/chicken.js';

app.use(express.json());
app.use(pino({ logger: logger }));

app.use('/chicken', chickenRouter);


app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});
