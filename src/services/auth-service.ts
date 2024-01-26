import { AuthSettingsProvider } from './auth-settings-provider';
import { AuthSettings, DEFAULT_AUTH_SETTINGS, AuthEndPointsSettings } from "../settings";
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
    public jwt$ = new ReplaySubject<string>(1);

    /** Authentication data */
    public authenticationData$ = new ReplaySubject<any | null>(1);

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
            let authenticated = false;
            // Flag to determine if an invalid jwk has to be removed from storage.
            let cleanStorageFlag = false;
            let jwt = '';
            let authenticationData: any = null
            if (!onlySessionStorage) {
                const urlTokens = window.location.href.split('#');
                console.log('AuthService _initializeJWT urlTokens', urlTokens);
                const newLocation = urlTokens?.[0];
                if (newLocation !== window.location.href) {
                    console.log('AuthService _initializeJWT newLocation', newLocation);
                    history.replaceState({}, '', newLocation);
                }
                const urlParams = new URLSearchParams(urlTokens?.[1]);
                jwt = urlParams.get('access_token') || '';


                console.log('AuthService _initializeJWT jwt', jwt);
            }

            if (!jwt) {
                jwt = sessionStorage.getItem(settings.jwtStorageKey) || '';
                cleanStorageFlag = true; // If the jwt is not valid it has to be removed from session storage.
            }
            if (jwt) {

                const validationEndpoint = this._fetchEndPoints(settings)?.validation;
                this._introspect(validationEndpoint, jwt)
                    .then(data => {
                        console.log('_initializeJWT data', authenticationData);
                        authenticationData = data?.profile;
                        console.log('_initializeJWT authenticationData', authenticationData);
                        authenticated = data?.active;
                        console.log('_initializeJWT data', authenticationData);

                        console.log('_initializeJWT authenticated', authenticated);


                    })
                    .catch(err => console.log('AuthService _initializeJWT err', err))
                    .finally(() => {
                        if (authenticated) {
                            sessionStorage.setItem(settings.jwtStorageKey, jwt);

                        } else if (cleanStorageFlag) {
                            sessionStorage.removeItem(settings.jwtStorageKey);
                        }
                        this.authenticated$.next(authenticated);
                        this.jwt$.next(jwt);
                        console.log('AuthService _initializeJWT authenticationData$ emetting', authenticationData);
                        this.authenticationData$.next(authenticationData);
                    });
            } else {
                console.log('AuthService _initializeJWT authenticated', authenticated);
                this.authenticated$.next(authenticated);
                this.jwt$.next('');
                console.log('AuthService _initializeJWT authenticationData$ emetting null');
                this.authenticationData$.next(null)
            }
        });
    }



    /**
     * Introspects a JWT.
     * @param url The introspection end point.
     * @param jwt The JWT to introspect.
     * @returns The introspection data.
     */
    private async _introspect(url: string, jwt: string): Promise<any> {
        console.log('_introspect url', url);


        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "x-authorization": jwt
            },
            method: "post",
        });
        const status = response.status;
        console.log('_introspect status', status);
        if (status !== 200) {
            console.log('Error status', status);
            return null;
        }
        const data = response.json();
        console.log('_introspect data', data);
        return data;
    }



    login() {
        this._settingsProvider.settings$.pipe(
            filter(settings => !!settings?.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            const loginEndPoint = this._fetchEndPoints(settings)?.login;
            console.log('AuthService login, settings', settings);
            console.log('AuthService login, loginEndPoint', loginEndPoint);
            window.location.href =       loginEndPoint;
        });
    }

    logout() {
        this._settingsProvider.settings$.pipe(
            filter(settings => !!settings.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            const logoutEndPoint = this._fetchEndPoints(settings)?.logout;
            
            console.log('AuthService logout, settings', settings);
            console.log('AuthService login, logoutEndPoint', logoutEndPoint);
            sessionStorage.removeItem(settings.jwtStorageKey);
            window.location.href = logoutEndPoint
      })
    }

    _fetchEndPoints(settings: AuthSettings): AuthEndPointsSettings {
        const hostname = window.location.hostname;
        console.log('AuthService _fetchEndPoints hostname', hostname);
        if (hostname === 'localhost' || hostname === '127.0.0.1'){
           return settings?.routes?.local;
        }
        if (hostname.includes('srv-dev-avenir')) {
            return settings.routes.dev;
        }

        return settings?.routes?.prod;
      
    }




}