import pino from "pino";
// import { SERVER_ENV } from "@sve/env";

enum LogLevel {
  EVENT = 'EVENT',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

const logLevels = {
  [LogLevel.EVENT]: 10,
  [LogLevel.DEBUG]: 20,
  [LogLevel.INFO]: 30,
  [LogLevel.WARN]: 40,
  [LogLevel.ERROR]: 50,
  [LogLevel.FATAL]: 60,
}

const pinoTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
    levelFirst: true,
  }
}

const logger = pino({
  level: 'debug',
  customLevels: logLevels,
  useOnlyCustomLevels: true,
  transport: pinoTransport,
});

export default logger;