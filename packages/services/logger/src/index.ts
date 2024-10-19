import { axiomClient } from '@sve/axiom-client';
import platform from 'platform';
import { SERVER_ENV } from "@sve/env";

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
  // private logLevel: LogLevel;

  constructor(_logLevel: LogLevel = LogLevel.INFO) {
    // this.logLevel = logLevel;
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
    if (data instanceof Error) {
      const slicedMessage = data?.message?.length > 250 ? data.message.slice(0, 250) : data.message;
      this.logMessage(LogLevel.ERROR, message, logLocation, {
        name: data.name,
        cause: data.cause,
        message: slicedMessage,
        stack: data.stack,
      });
    } else {
      this.logMessage(LogLevel.ERROR, message, logLocation, data);
    }
  }

  event(message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    this.logMessage(LogLevel.EVENT, message, logLocation, data);
  }

  private logMessage(level: LogLevel, message: string, logLocation: string | undefined = undefined, data: unknown = undefined): void {
    let splicedData: any = null;
    if (data && Array.isArray(data) && data.length > 250) {
      splicedData = data.slice(0, 250);
    } else if (data && typeof data === 'object' && Object.keys(data).length > 250) {
      splicedData = Object.fromEntries(
        Object.entries(data as object).slice(0, 250),
      );
    }

    const timestamp = new Date().toISOString();
    const ingestString = `[${timestamp}] [${level}]: \n\nMessage: ${message}\nData: ${data ? JSON.stringify(splicedData || data, null, 2) : 'N/A'}`;
      if (SERVER_ENV.AXIOM_DATASET && axiomClient) {
        axiomClient.ingest(SERVER_ENV.AXIOM_DATASET, [{
          message: ingestString,
          platform: platform as object,
          timestamp: `${timestamp}`,
          // data: splicedData || data,
          logLocation: logLocation || 'NA',
        }]);
      } else {
        console.warn('Skipping Axiom ingestion: AXIOM_DATASET not defined or axiomClient not instantiated');
      }
  }

  // private isLogLevelEnabled(level: LogLevel): boolean {
  //   return Object.values(LogLevel).indexOf(this.logLevel) <= Object.values(LogLevel).indexOf(level);
  // }
}

export const logger = new ConsoleLogger(envLogLevelOrDebug());
export const prettyPrint = (ingestObject: object): string => JSON?.stringify(ingestObject, null, 2);