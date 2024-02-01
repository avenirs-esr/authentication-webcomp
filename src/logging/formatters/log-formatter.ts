import { LogLevel } from '../levels';
import { LogMessage, LoggingContext } from '../models';



/**
 * Log formatter.
 * Generates a LogMessage that can be handled by the appender.
 *
 */

/**
 * Log formatter.
 * Generates a LogMessage that can be handled by the appender.
 * @date 01/02/2024 - 16:19:43
 * @author A. Deman
 *
 * @export
 * @interface LogFormatter
 * @type {LogFormatter}
 */
export interface LogFormatter {
   
    /**
    * @param {string}name Name of the logger.
    * @param {LogLevell} logLevel the level of the logger.
    * @param {any[]} messageParts The message parts.
    * @param {?LoggingContext} context The context of the log.
    * @returns {LogMessage} The formatted message.
    */
    format: (name: string, logLevel: LogLevel, messageParts: any[], context?: LoggingContext) => LogMessage;
}