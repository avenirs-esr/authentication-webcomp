import { LogLevel } from '../levels';
import { ConsoleLoggerFactory } from './../factories/';
import { LoggingSettings } from './logging-settings';


/**
 * Default settings.
 * @date 01/02/2024 - 16:31:26
 * @author A. Deman
 *
 * @type {LoggingSettings}
 */
export const DEFAULT_LOGGING_SETTINGS: LoggingSettings = {

    factories: {
        default: new ConsoleLoggerFactory(),
    },

    levels: {
        default: LogLevel.default,
    }
}