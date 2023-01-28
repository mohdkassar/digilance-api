import express from 'express';
import _ from 'lodash';
import config from 'config';
import cors from 'cors';

import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './swagger/routes';

class Main {
  public async initialise(app: express.Application): Promise<void> {
    console.log('Initialising express app startup');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      cors({
        origin: '*',
        exposedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
      })
    );

    RegisterRoutes(app);
    app.use(this.catchValidationErrors);
    app.use(function notFoundHandler(_req, res: express.Response) {
      res.status(404).send({
        message: 'Not Found',
      });
    });

    app.listen(config.get('api.port'));
    console.log(
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
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: err?.fields,
      });
    }

    return next();
  }
}

new Main().initialise(express()).catch(console.error);
