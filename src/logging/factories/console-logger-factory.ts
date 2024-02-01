import { DefaultLogFormatter, LogFormatter } from './../formatters';
import { ConsoleAppender } from '../appenders';
import { LogLevel } from '../levels';
import { DefaultLogger, Logger } from "../loggers";
import { LoggerFactory } from './logger-factory';


/**
 * Factory for a console logger.
 * @date 01/02/2024 - 12:56:36
 * @author A. Deman
 *
 * @export {ConsoleLoggerFactory}
 * @class ConsoleLoggerFactory
 * @type {ConsoleLoggerFactory}
 * @implements {LoggerFactory}
 */
export class ConsoleLoggerFactory implements LoggerFactory {

    /**
     * Creates an instance of Logger that logs in the console.
     * @param {string} name The name of the logger.
     * @param {LogLevel} level The level of the logger.
      * @returns {Logger} The instance of ConsoleLogger.
     */
    createLogger(name: string, level: LogLevel, formatter?: LogFormatter) : Logger {
        return new DefaultLogger(name, level, formatter || new DefaultLogFormatter(),  new ConsoleAppender());
    }
}
