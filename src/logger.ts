import winston from 'winston';
import config from 'config';
import _ from 'lodash';

interface ILoggerConfig {
  loggerName: string;
  logLevel: string;
}

function initialiseLogger(config: ILoggerConfig): winston.Logger {
  const { logLevel, loggerName } = config;

  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: loggerName },
    transports: [
      new winston.transports.File({
        filename: process.env.error_file,
        level: 'error',
      }),
      new winston.transports.File({ filename: process.env.out_file }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  return logger;
}

const logger: winston.Logger = initialiseLogger({
  logLevel: config.get('logLevel'),
  loggerName: `digilance-api-${process.pid}`,
});

export default logger;
