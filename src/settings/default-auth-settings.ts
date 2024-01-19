import { AuthSettings } from './auth-settings';

/**
 * Default settings for the authentication.
 */
export const DEFAULT_AUTH_SETTINGS: AuthSettings = {
    jwtStorageKey : 'avenirs-jwt',
    baseURL: "http://localhost:3000",
    loginEndPoint: '/login',
    logoutEndPoint: '',
    redirectURI:''
}

// https://localhost/cas/login?service=https://localhost/node-api/cas-auth-callback
// https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20profile