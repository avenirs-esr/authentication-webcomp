import { AuthSettingsProvider } from './auth-settings-provider';
import { AuthSettings, DEFAULT_AUTH_SETTINGS } from "../settings";
import { Observable, ReplaySubject, filter, take } from 'rxjs';


/**
    * Authentication service. 
    * This class is a singleton, the constructor will return the same instance.
    * 1. Try to retrieve the jwt from the URL.
    *       * If found: it is registered in the session storage.
    *       * If not found: try to find it in session storage.
    * 2. Iff there is a jwt it is validated.
    * 3. If there is a valid jwt, the user is authenticated.
    * 4. If not redirect to the oidc provider to retrieve a jwt.
    */
export class AuthService {

    /** Singleton instance. */
    private static _INSTANCE: AuthService;

    /** Authentication settings. */
    private _settingsProvider = new AuthSettingsProvider();

    /** Authenticated status observable. */
    public authenticated$ = new ReplaySubject<boolean>(1)

    /** The active jwt  observable. */
    private jwt$ = new ReplaySubject<string>(1);

    /**
     * Singleton constructor.
     * @returns the unique instance of this class. 
     */
    constructor() {
        if (!AuthService._INSTANCE) {
            this._initializeJWT();
            AuthService._INSTANCE = this;
        }
        return AuthService._INSTANCE;
    }

    /**
     * Trye to fectch a JWT.
     * @param onlySessionStorage Flag to determine if the JWT can be retrieved from the location.
     */ 
    private _initializeJWT(onlySessionStorage = false) {
        this._settingsProvider.settings$.pipe(
            filter(settings => !!settings?.jwtStorageKey),
            take(1)
        ).subscribe(settings => {
            
            // Flag to determine if an invalid jwk has to be removed from storage.
            let cleanStorageFlag = false;
            let jwt = '';
            if (! onlySessionStorage) {
            const urlParams = new URLSearchParams(window.location.href.split('#')?.[1]);
            jwt = urlParams.get('access_token') || '';

            console.log('_initializeJWT jwt', jwt);
            }

            if (!jwt) { 
                jwt = sessionStorage.getItem(settings.jwtStorageKey) || '';
                cleanStorageFlag = true; // If the jwt is not valid it has to be removed from session storage.
            }
            if (jwt){
                // [TODO] Select the host from the one in the location.
                this._introspect("http://localhost/node-api/cas-auth-validate", jwt)
                .then(data => {
                    console.log('_initializeJWT data', data);
                    const authenticated=data?.active;
                    this.authenticated$.next(authenticated);
                    console.log('_initializeJWT authenticated', authenticated);
                    if (authenticated){
                        sessionStorage.setItem(settings.jwtStorageKey, jwt);
                        this.jwt$.next(jwt);
                    } else if (cleanStorageFlag){
                        sessionStorage.removeItem(settings.jwtStorageKey);
                    }
                })
                .catch(err => console.log('_initializeJWT err', err));
            }
        });
    }


    /**
     * Introspects a JWT.
     * @param url The introspection end point.
     * @param jwt The JWT to check.
     * @returns The introspection data.
     */
    private async _introspect(url: string, jwt: string) {
        console.log('_apiCall url', url);
       

        const response = await fetch(url, {
           headers: {
                "Content-Type": "application/json",
                "x-authorization": jwt
            },
            method: "post",
        });
        const status = response.status
        console.log('_apiCall status', status);
        const data =  response.json();
        console.log('_apiCall data', data);
        return data;
    }

   

    login() {
        this._settingsProvider.settings$.pipe(
            filter(settings => !!settings?.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            console.log('AuthService login, settings', settings);
            const url = settings.baseURL + settings.loginEndPoint;

            console.log('AuthService login, url', url);
            //sessionStorage.setItem(settings.jwtStorageKey, 'myToken');
            window.location.href = "https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20profile"
            //window.location.href = "https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost:8000/demo&response_type=code&scope=openid%20profile"
            //  localStorage.setItem(settings?.jwtStorageKey, 'true');
            //  this.authenticated$.next(true);
        });
    }

    logout() {
        this._settingsProvider.settings$.pipe(
            filter(settings => !!settings.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            console.log('AuthService logout');
            const url = settings.baseURL + settings.logoutEndPoint
            console.log('AuthService logout, url', url);
            sessionStorage.removeItem(settings.jwtStorageKey);
            window.location.href = "https://localhost/cas/logout?service=https://localhost/node-api/cas-auth-callback"
            
        })
    }

   

}