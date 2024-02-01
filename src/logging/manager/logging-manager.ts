import { Logger } from '../loggers';
import { LoggingSettings } from '../settings';

/**
 * ogging manager.
 * Handles the initialization of the logging and the creation managment of Loggers.
 * @date 01/02/2024 - 16:29:02
 * @author A. Deman
 *
 * @export
 * @class LoggingManager
 * @type {LoggingManager}
 */
export class LoggingManager {

    /** Singleton instance. */
    private static _INSTANCE: LoggingManager;

    /** The name of the root logger (which is the default logger) */
    private static _ROOT_LOGGER_NAME = 'root';

    /** The loggers registry. */
    private _loggers: { [name: string]: Logger } = {}

    private _settings?: LoggingSettings;

    /**
     * Creates an instance of LoggingManager.
     * @date 01/02/2024 - 15:48:36
     *
     * @constructor
     * @param {?LoggingSettings} [settings] The settings to use. Optional if an instance has already been created.
     */
    constructor(settings?: LoggingSettings) {

        if (!LoggingManager._INSTANCE) {
            if (!settings) {
                throw new Error('Missing settings. The settings are optional only if they have been set previously via the constructor or initialize static method.');
            }
            LoggingManager._INSTANCE = this;
            this._settings = settings;

        }

        return LoggingManager._INSTANCE;
    }


    /**
     * Initilization of the singleton instance.
     * @date 01/02/2024 - 15:53:01
     *
     * @static
     * @param {LoggingSettings} settings
     */
    static initialize(settings: LoggingSettings) {
        new LoggingManager(settings);
    }

    /**
     * 
     * @param name The name of the logger to create.
     * @returns The new created logger, using the factory, level and appender specified in settings.
     */
    createLogger(name: string): Logger {
        const level = this.settings.levels?.[name] || this.settings.levels.default;
        const factory = this.settings.factories?.[name] || this.settings?.factories?.default;
        return factory?.createLogger(name, level);
    }

    /**
     * Gives a logger associated to a name. If the logger does not exist it is created.
     * @param name The name of the logger to retrieve.
     * @returns The logger.
     */
    getLogger(name = LoggingManager._ROOT_LOGGER_NAME): Logger {

        // Creates the logger if it does not exist.
        if (!this._loggers[name]) {
            this._loggers[name] = this.createLogger(name);
        }

        return this._loggers[name];
    }


    
    /**
     * Hack to get a not undefined instance of settings.
     * @date 01/02/2024 - 16:29:53
     * @author A. Deman
     *
     * @private
     * @readonly
     * @type {LoggingSettings}
     */
    private get settings(): LoggingSettings {
        return this._settings as LoggingSettings;
    }


}