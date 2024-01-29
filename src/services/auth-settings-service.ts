import { AuthEndPointsSettings, AuthSettings, DEFAULT_AUTH_SETTINGS } from "../settings";
import { Observable, ReplaySubject, filter, map } from 'rxjs';

/**
    * Authentication settings provider service. 
    * Provides the an instance of Settings and helper functions. 
    */
export class AuthSettingsService {

    /** Singleton instance. */
    private static _INSTANCE: AuthSettingsService;

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
            AuthSettingsService._INSTANCE.settings$.next(settings);
        }
        return AuthSettingsService._INSTANCE;
    }

    /**
     * Updates the settings.
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
        console.log('selectEndPointsForHost hostname',hostname);
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return settings?.routes?.local;
        }
        if (hostname.includes('srv-dev-avenir')) {
            return settings.routes.dev;
        }

        return settings?.routes?.prod;

    }
}