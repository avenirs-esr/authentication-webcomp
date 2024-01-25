import { AuthSettings } from './auth-settings';

/**
 * Default settings for the authentication.
 * storage key for the jwt and end points: login, logout, etc.
 */
export const DEFAULT_AUTH_SETTINGS: AuthSettings = {
    jwtStorageKey : 'avenirs-jwt',
    routes: {
        local: {
            login:'https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20email%20profile',
            logout: 'https://localhost/cas/oidc/oidcLogout?service=https://localhost/node-api/cas-auth-callback',
        },
        dev: {
            login:'https://${this.backend}/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20email%20profile',
            logout: 'https://avenirs-apache/cas/oidc/oidcLogout?service=https://localhost/node-api/cas-auth-callback',
        },
        prod: {
            login:'',
            logout: '',
        },
    }
}
