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
            validation:'http://localhost/node-api/cas-auth-validate',
            test:'http://localhost/apisix-gw/ipoidc'
        },
        dev: {
            login:'https://srv-dev-avenir.srv-avenir.brgm.recia.net/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://srv-dev-avenir.srv-avenir.brgm.recia.net/node-api/cas-auth-callback&response_type=code&scope=openid%20email%20profile',
            logout: 'https://srv-dev-avenir.srv-avenir.brgm.recia.net/cas/oidc/oidcLogout?service=https://srv-dev-avenir.srv-avenir.brgm.recia.net/node-api/cas-auth-callback',
            validation:'https://srv-dev-avenir.srv-avenir.brgm.recia.net/node-api/cas-auth-validate',
            test:'http://srv-dev-avenir.srv-avenir.brgm.recia.net/apisix-gw/ipoidc'
        },
        prod: {
            login:'',
            logout: '',
            validation:''
        },
    }
}
