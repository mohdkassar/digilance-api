import express from 'express';
import _ from 'lodash';
import config from 'config';
import cors from 'cors';

import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './swagger/routes';
import logger from './logger';

class Main {
  public async initialise(app: express.Application): Promise<void> {
    logger.info('Initialising express app startup');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      cors({
        origin: '*',
        exposedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        optionsSuccessStatus: 200,
      })
    );
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    RegisterRoutes(app);
    app.use(this.catchValidationErrors);
    app.use(function notFoundHandler(_req, res: express.Response) {
      res.status(404).send({
        message: 'Not Found',
      });
    });

    app.listen(config.get('api.port'));
    logger.info(
      `Express app startup complete - listening on port: ${config.get(
        'api.port'
      )}`
    );
  }

  private catchValidationErrors(
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (err instanceof ValidateError) {
      logger.error(err);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: err?.fields,
      });
    }

    return next();
  }
}

new Main().initialise(express()).catch(logger.error);
