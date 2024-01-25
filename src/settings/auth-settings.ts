import { AuthRoutesSettings } from './auth-routes-settings';

/**
 * Authentication settings.
 * key to store the jwt, authentication routes.
 */
export interface AuthSettings {

    /** Key to store the jwt in the local storage. */
    jwtStorageKey: string;

    /** The end points tu use: login, logout, service, etc. */
    routes: AuthRoutesSettings;
}

