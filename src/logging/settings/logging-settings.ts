import { LoggerFactory } from '../factories';
import { LogFormatter } from '../formatters';
import { LogLevel } from '../levels';


/**
 * Settings for the logging system.
 * @date 01/02/2024 - 16:30:58
 * @author A. Deman
 *
 * @export
 * @interface LoggingSettings
 * @type {LoggingSettings}
 */
export interface LoggingSettings {

    /** Factories used to creates the logger. */
    factories: {

        /** Default logger factory. */
        default: LoggerFactory,

        /** Specific factories by logger name. */
        [name: string]: LoggerFactory
    };

    /** Levels of the loggers. */
    levels: {

        /** Default log level. */
        default: LogLevel,

        /** Specific log levels by logger name.  */
        [name: string]: LogLevel
    };

    /** Log formatters. */
    formatters?: {

        /** Specific log formatter by logger name. */
        [name: string]: LogFormatter
    }
}