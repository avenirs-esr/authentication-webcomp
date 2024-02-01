import { LogFormatter } from '../formatters';
import { LogLevel } from '../levels';
import { Logger } from "../loggers";


/**
 * Logger factory
 * @date 01/02/2024 - 12:45:17
 * @author A. Deman.
 *
 * @export {LoggerFactory}
 * @interface LoggerFactory
 * @typedef {LoggerFactory}
 */
export interface LoggerFactory {

     /**
    * Factory method.
    * @param name Name off the logger.
    * @param level The level from which the logger will handle the messages.
    * @param logFormatter Optional, formatteur to use instead of the one 
    * @returns {Logger}.
    */

    
    /**
     * Description placeholder
     * @date 01/02/2024 - 14:37:42
     *
     * @param {string} name Name off the logger.
     * @param {LogLevel} level The level from which the logger will handle the messages.
     * @param {?LogFormatter} [formatter] formatter to use instead of the one provided by the factory.
     * @returns {Logger} The Logger instance.
     */
    createLogger(name: string, level: LogLevel, formatter?: LogFormatter): Logger;
}