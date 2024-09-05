import { axiomClient } from '@sve/axiom-client';
import platform from 'platform';
require('dotenv').config({ path: "../../../.env" });

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  EVENT = 'EVENT',
}

const envLogLevelOrDebug = (): LogLevel => {
  const envLogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || 'DEBUG').toUpperCase();
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

  debug(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.DEBUG, message, logLocation, data);
  }

  info(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.INFO, message, logLocation, data);
  }

  warn(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.WARN, message, logLocation, data);
  }

  error(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.ERROR, message, logLocation, data);
  }

  event(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.EVENT, message, logLocation, data);
  }

  private logMessage(level: LogLevel, message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    if (this.isLogLevelEnabled(level)) {
      const timestamp = new Date().toISOString();
      const ingestString = `[${timestamp}] [${level}] - ${message} ${data ? JSON.stringify(data, null, 2) : ''}`;
      console.log(ingestString);
      if (!process.env.NEXT_PUBLIC_AXIOM_DATASET) throw new Error('NEXT_PUBLIC_AXIOM_DATASET not defined within the env file...');
      if (!axiomClient) throw new Error('Axiom client not instantiated');
      axiomClient.ingest(process.env.NEXT_PUBLIC_AXIOM_DATASET!, [{
        message: ingestString,
        platform: platform as object,
        timestamp: `${timestamp}`,
        data,
        logLocation: logLocation || 'NA',
      }]);
    }
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return Object.values(LogLevel).indexOf(this.logLevel) <= Object.values(LogLevel).indexOf(level);
  }
}

export const logger = new ConsoleLogger(envLogLevelOrDebug());