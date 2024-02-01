import { NoopLogger } from './../logging/loggers/noop-logger';
import { ReplaySubject } from 'rxjs';
import { Logger, LoggingManager } from "../logging";
import { AuthEndPointsSettings, AuthSettings } from "../settings";

/**
 * Authentication settings provider service. 
 * Provides an instance of Settings and helper functions. 
 * It also initialize the logging system.
 * @date 01/02/2024 - 16:33:40
 * @author A. Deman
 *
 * @export
 * @class AuthSettingsService
 * @type {AuthSettingsService}
 */
export class AuthSettingsService {

    /** Singleton instance. */
    private static _INSTANCE: AuthSettingsService;

    /** The logger for this instance. */
    private _logger: Logger = new NoopLogger();

    /** settings. */
    settings$ = new ReplaySubject<AuthSettings>(1);

    /**
    * Singleton constructor.
    * @param settings: The initial instance of settings (optional)
    * @returns the unique instance of this class. 
    */
    constructor(settings?: AuthSettings) {

        if (!AuthSettingsService._INSTANCE) {
            AuthSettingsService._INSTANCE = this;
        }
        if (settings) {
            LoggingManager.initialize(settings.logging);
            this._logger = new LoggingManager().getLogger('AuthSettingsService');
            AuthSettingsService._INSTANCE.settings$.next(settings);
        }
        return AuthSettingsService._INSTANCE;
    }
    
    /**
     * Updates the setttings.
     * @date 01/02/2024 - 16:38:10
     *
     * @param {AuthSettings} settings
     */
    update(settings: AuthSettings): void {
        this.settings$.next(settings);
    }

    /**
     * Helper function to select the endpoint (local, dev, prod) based on the hostname.
     * @param settings The instance of settings.
     * @param hostname The current hostname.
     * @returns  An the end points to use for the current hostname.
     */
    selectEndPointsForHost(settings: AuthSettings, hostname: string): AuthEndPointsSettings {
        this._logger
            .enter('selectEndPointsForHost')
            .debug('selectEndPointsForHost hostname',hostname)
            .leave();
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return settings?.routes?.local;
        }
        if (hostname.includes('srv-dev-avenir')) {
            return settings.routes.dev;
        }

        return settings?.routes?.prod;

    }
}