import { AuthSettings, DEFAULT_AUTH_SETTINGS } from "../settings";
import { Observable, ReplaySubject } from 'rxjs';

/**
    * Settings provider service. 
    * Provides the an instance of Settings. 
    */
export class AuthSettingsProvider {

     /** Singleton instance. */
     private static _INSTANCE: AuthSettingsProvider;

    /** settings. */
    settings$ = new ReplaySubject<AuthSettings>(1);

     /**
     * Singleton constructor.
     * @param settings: The initial instance of settings (optional)
     * @returns the unique instance of this class. 
     */
     constructor(settings?: AuthSettings) {
        
        if (!AuthSettingsProvider._INSTANCE) {
            AuthSettingsProvider._INSTANCE = this;
        }
        if(settings) {
            AuthSettingsProvider._INSTANCE.settings$.next(settings);
        }
        return AuthSettingsProvider._INSTANCE;
    }

    /**
     * Updates the settings.
     */
    update(settings: AuthSettings): void {
        this.settings$.next(settings);
    }
}