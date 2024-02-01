import { LoggingSettings } from '../logging';
import { AuthRoutesSettings } from './auth-routes-settings';

/**
 * Authentication settings.
 * key to store the jwt, authentication routes, etc.
 * @date 01/02/2024 - 16:40:38
 *
 * @export
 * @interface AuthSettings
 * @typedef {AuthSettings}
 */
export interface AuthSettings {

    /** Key to store the jwt in the local storage. */
    jwtStorageKey: string;

    /** The end points tu use: login, logout, service, etc. */
    routes: AuthRoutesSettings;

    /** Logging settings. */
    logging: LoggingSettings;
}

