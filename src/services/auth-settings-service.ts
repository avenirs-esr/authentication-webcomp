import { AuthSettings, DEFAULT_AUTH_SETTINGS } from "../settings";
import { Observable, ReplaySubject } from 'rxjs';

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
        if(settings) {
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
}