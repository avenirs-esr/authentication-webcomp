
/**
 * Authentication settings.
 */
export interface AuthSettings {

    /** Key to store the jwt in the local storage. */
    jwtStorageKey: string;

    /** Base url for the end points */
    baseURL: string;

    /** URL to login*/
    loginEndPoint: string;

    /** URL to logout*/
    logoutEndPoint: string;

    /** The redirection url ater login*/
    redirectURI: string;
}

