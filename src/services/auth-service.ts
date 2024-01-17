import { AuthSettings, DEFAULT_AUTH_SETTINGS } from "../settings";
import { Observable, ReplaySubject } from 'rxjs';


/**
    * Authentication service. 
    * This class is a singleton, the cnostructor will return the same instance.
    * 
    */
export class AuthService {

    /** Defaut key to keep the jwt */
    private static DEF_LOCAL_STORAGE_KEY = 'avenirs-jwt'

    /** Singleton instance. */
    private static _INSTANCE: AuthService;

    /** Authentication settings. */
    private _settings: AuthSettings = DEFAULT_AUTH_SETTINGS;

    /** Authenticated status observable */
    public authenticated$ = new ReplaySubject<boolean>(1)

    /**
     * Singleton constructor.
     * @returns the unique instance of this class. 
     */
    constructor(authSettings?: AuthSettings) {

        if (AuthService._INSTANCE) {
            if (authSettings) {
                const jwtStorageKey = authSettings.jwtStorageKey || DEFAULT_AUTH_SETTINGS.jwtStorageKey;
                if (jwtStorageKey !== AuthService._INSTANCE._settings?.jwtStorageKey) {
                    throw new Error('An instance of AuthService already exists with a different storage key: '
                        + `${AuthService._INSTANCE._settings?.jwtStorageKey} (current) is different from ${jwtStorageKey} (new one).`)
                }
            }
            return AuthService._INSTANCE;
        }
        console.log('AuthService creation of a new instance');

        // Initializes the settings with the default values if needed.
        this._settings = {
            ...DEFAULT_AUTH_SETTINGS,
            ...authSettings
        };
        this._settings.jwtStorageKey = this._settings.jwtStorageKey?.trim();
        if (this._settings.jwtStorageKey) {
            this.authenticated$.next(!!localStorage.getItem(this._settings.jwtStorageKey));
        }
        return AuthService._INSTANCE = this;
    }

    login() {
        if (this._settings.jwtStorageKey) {
            console.log('AuthService login');
            localStorage.setItem(this._settings.jwtStorageKey, 'true');
            this.authenticated$.next(true);
        }
    }

    logout() {
        if (this._settings.jwtStorageKey) {
            console.log('AuthService logout');
            localStorage.removeItem(this._settings.jwtStorageKey);
            this.authenticated$.next(false)
        }
    }



}