import {
  createLogger,
  format,
  transports,
} from 'winston';

const logTransports = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack,
          };
        }
        return value;
      },
    }),
  }),
];

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp()
  ),
  transports: logTransports,
  defaultMeta: { service: 'api' },
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: 'debug',
  }));
}

export default logger;
