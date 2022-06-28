import {
  createLogger, Logger, transports, format,
} from 'winston';

const {
  combine, timestamp, label, printf,
} = format;

const myFormat = printf(({
  level, message, label: labelText, timestamp: timestamps,
}) => `${timestamps} [${labelText}] ${level}: ${typeof message === 'string' ? message : JSON.stringify(message)}`);

export const createLog = (service: string): Logger => createLogger({
  format: combine(
    label({ label: service }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
  ],
});

export default {
  createLog,
};
