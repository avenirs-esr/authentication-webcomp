import { ReplaySubject, filter, take } from 'rxjs';
import { AuthSettingsService } from './auth-settings-service';
import { LoggingManager } from '../logging';
import { NoopLogger } from '../logging/loggers/noop-logger';

/**
 * Authentication service. 
 * This class is a singleton, the constructor will return the same instance.
 * 1. Try to retrieve the jwt from the URL.
 *       * If found: it is registered in the session storage.
 *       * If not found: try to find it in session storage.
 * 2. If there is a jwt it is validated.
 * 3. If there is a valid jwt, the user is authenticated.
 * 4. If not redirect to the oidc provider to retrieve a jwt.
 * @date 01/02/2024 - 16:32:26
 * @author A. Deman
 *
 * @export
 * @class AuthService
 * @typedef {AuthService}
 */
export class AuthService {

    /** Singleton instance. */
    private static _INSTANCE: AuthService;

    /** Authentication settings service. */
    private _settingsService = new AuthSettingsService();

    /** Authenticated status observable. */
    public authenticated$ = new ReplaySubject<boolean>(1)

    /** The active jwt  observable. */
    public jwt$ = new ReplaySubject<string>(1);

    /** Authentication data */
    public authenticationData$ = new ReplaySubject<any | null>(1);

    /** Flag to determine if the authentication service is initialized, i.e.: the authenticatio nstatus is known.  */
    public authenticationStatusKnown = false;

    /** Loger for this class. */
    private _logger = new NoopLogger();

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
     * Tries to fetch a JWT.
     * @param onlySessionStorage Flag to determine if the JWT can be retrieved from the location.
     */
    private _initializeJWT(onlySessionStorage = false) {
        this._settingsService.settings$.pipe(
            filter(settings => !!settings?.jwtStorageKey),
            take(1)
        ).subscribe(settings => {
            this._logger = new LoggingManager(settings.logging).getLogger('AuthService').enter('_initializeJWT');
            this._logger.info('Initialization of JWT')
            let authenticated = false;
            // Flag to determine if an invalid jwk has to be removed from storage.
            let cleanStorageFlag = false;
            let jwt = '';
            let authenticationData: any = null
            if (!onlySessionStorage) {
                const urlTokens = window.location.href.split('#');
                this._logger.debug('ObserveDirective AuthService _initializeJWT urlTokens', urlTokens);
                const newLocation = urlTokens?.[0];
                if (newLocation !== window.location.href) {
                    this._logger.trace('AuthService _initializeJWT newLocation', newLocation);
                    history.replaceState({}, '', newLocation);
                }
                const urlParams = new URLSearchParams(urlTokens?.[1]);
                jwt = urlParams.get('access_token') || '';


                this._logger.debug('AuthService _initializeJWT jwt', jwt);
            }

            if (!jwt) {
                jwt = sessionStorage.getItem(settings.jwtStorageKey) || '';
                cleanStorageFlag = true; // If the jwt is not valid it has to be removed from session storage.
            }
            if (jwt) {

                const validationEndpoint = this._settingsService.selectEndPointsForHost(settings, window.location.hostname)?.validation;
                this._introspect(validationEndpoint, jwt)
                    .then(data => {
                        this._logger.trace('_initializeJWT data', authenticationData);
                        authenticationData = data?.profile;
                        this._logger.trace('_initializeJWT authenticationData', authenticationData);
                        authenticated = data?.active;
                        this._logger.trace('_initializeJWT data', authenticationData);

                        this._logger.trace('_initializeJWT authenticated', authenticated);


                    })
                    .catch(err => this._logger.error('AuthService _initializeJWT err', err))
                    .finally(() => {
                        if (authenticated) {
                            sessionStorage.setItem(settings.jwtStorageKey, jwt);

                        } else if (cleanStorageFlag) {
                            sessionStorage.removeItem(settings.jwtStorageKey);
                        }
                        this._logger.trace('ObserveDirective AuthService _initializeJWT authenticated$ emetting', authenticated);
                        this.authenticated$.next(authenticated);
                        this.jwt$.next(jwt);
                        this._logger.trace('ObserveDirective AuthService _initializeJWT authenticationData$ emetting', authenticationData);
                        this.authenticationStatusKnown = true;
                        this.authenticationData$.next(authenticationData);
                    });
            } else {
                this._logger.trace('ObserveDirective AuthService _initializeJWT (no jwt) authenticated$ emetting', authenticated);
                this.authenticated$.next(authenticated);
                this.jwt$.next('');
                this._logger.trace('AuthService _initializeJWT authenticationData$ emetting null');
                this.authenticationStatusKnown = true;
                this.authenticationData$.next(null)
            }
            this._logger.leave();
        });
    }

    /**
     * Introspects a JWT.
     * @param url The introspection end point.
     * @param jwt The JWT to introspect.
     * @returns The introspection data.
     */
    private async _introspect(url: string, jwt: string): Promise<any> {
        this._logger.enter('_introspect').debug('_introspect url', url);


        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "x-authorization": jwt
            },
            method: "post",
        });
        const status = response.status;
        this._logger.debug('_introspect status', status);
        if (status !== 200) {
            this._logger.error('Error status', status);
            return null;
        }
        const data = response.json();
        this._logger.debug('_introspect data', data).leave();
        return data;
    }

    /**
     * Performs the login action.
     */
    login() {
        
        this._settingsService.settings$.pipe(
            filter(settings => !!settings?.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            const loginEndPoint = this._settingsService.selectEndPointsForHost(settings, window.location.hostname)?.login;
            this._logger.enter('login').debug('AuthService login, loginEndPoint', loginEndPoint);
            this._logger.debug('AuthService login, settings', settings).leave();
            window.location.href = loginEndPoint;
        });
    }

    /**
    * Performs the logout action.
    */
    logout() {
        this._settingsService.settings$.pipe(
            filter(settings => !!settings.jwtStorageKey),
            take(1),
        ).subscribe(settings => {
            const logoutEndPoint = this._settingsService.selectEndPointsForHost(settings, window.location.hostname)?.logout;
            this._logger.enter('logout')
                .debug('AuthService login, logoutEndPoint', logoutEndPoint)
                .leave();
            sessionStorage.removeItem(settings.jwtStorageKey);
            window.location.href = logoutEndPoint
        })
    }
}