import { axiomClient } from '@sve/axiom-client';
import platform from 'platform';
import { SERVER_ENV } from "@sve/env";  ;

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  EVENT = 'EVENT',
}

const envLogLevelOrDebug = (): LogLevel => {
  const envLogLevel = (SERVER_ENV.LOG_LEVEL || 'DEBUG').toUpperCase();
  const filtered = Object.keys(LogLevel).filter((ll) => ll === envLogLevel);
  return (filtered.length > 0 ? filtered[0] : LogLevel.DEBUG) as LogLevel;
};

class ConsoleLogger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  static async flushLogs(): Promise<void> {
    await axiomClient.flush();
  }

  debug(message: string, data: unknown = undefined, trace: string | undefined = undefined, file: string| undefined = undefined): void {
    this.logMessage(LogLevel.DEBUG, message, trace, file, data);
  }

  info(message: string, data: unknown = undefined, trace: string | undefined = undefined, file: string | undefined = undefined): void {
    this.logMessage(LogLevel.INFO, message, trace, file, data);
  }

  warn(message: string, data: unknown = undefined, trace: string | undefined = undefined, file: string | undefined = undefined): void {
    this.logMessage(LogLevel.WARN, message, trace, file, data);
  }

  error(message: string, data: unknown = undefined, trace: string | undefined = undefined, file: string | undefined = undefined): void {
    this.logMessage(LogLevel.ERROR, message, trace, file, data);
  }

  event(message: string, data: unknown = undefined, trace: string | undefined = undefined, file: string | undefined = undefined): void {
    this.logMessage(LogLevel.EVENT, message, trace, file, data);
  }

  private logMessage(level: LogLevel, message: string, trace: string | undefined, file: string | undefined = undefined, data: unknown = undefined): void {
    if (this.isLogLevelEnabled(level)) {
      const timestamp = new Date().toISOString();
      const ingestString = `[${timestamp}] [${level}] - ${message} ${data ? prettyPrint(data) : ''}`;
      console.log(ingestString);
      if (!SERVER_ENV.AXIOM_DATASET) throw new Error('AXIOM_DATASET not defined within the env file...');
      if (!axiomClient) throw new Error('Axiom client not instantiated');
      axiomClient.ingest(SERVER_ENV.AXIOM_DATASET!, [{
        message: ingestString,
        platform: platform as object,
        timestamp: `${timestamp}`,
        data,
        trace: trace || 'NA',
        logLocation: file || 'NA',
      }]);
    }
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return Object.values(LogLevel).indexOf(this.logLevel) <= Object.values(LogLevel).indexOf(level);
  }
}

export const logger = new ConsoleLogger(envLogLevelOrDebug());
export const prettyPrint = (ingestObject: object): string => JSON?.stringify(ingestObject, null, 2);