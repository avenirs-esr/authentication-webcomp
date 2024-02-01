import { ReplaySubject, combineLatest, filter, map, take, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { AuthSettingsService } from './auth-settings-service';



/**
 * Test query service.
 * Performs a query to check the oidc integration.
 * @date 01/02/2024 - 16:38:57
 * @author A. Deman.
 *
 * @export
 * @class TestQueryService
 * @typedef {TestQueryService}
 */
export class TestQueryService {

    /** Singleton instance. */
    private static _INSTANCE: TestQueryService;

    /** Authentication service. */
    private _authService = new AuthService();

    /** Authentication settings service. */
    private _settingsService = new AuthSettingsService();

    /** Observable for the responses */
    responseData$ = new ReplaySubject<any>(1);

    /**
     * Singleton constructor.
     * @returns the unique instance of this class. 
     */
    constructor() {
        if (!TestQueryService._INSTANCE) {
            TestQueryService._INSTANCE = this;
        }
        return TestQueryService._INSTANCE;
    }

    /**
    * Performs a test query with the jwt in the header.
    * @returns The returned data.
    */
    public async performAuthenticatedQuery(): Promise<void> {
        console.log("performAuthenticatedQuery");
       
        combineLatest([
            this._authService.jwt$,
            this._settingsService.settings$
        ]).pipe(
            take(1),
            tap(([jwt, settings]) => console.log('performAuthenticatedQuery jwt', jwt, 'settings', settings)),
            filter(([jwt, settings]) => !!settings && !!jwt),
            map(async ([jwt, settings]) => {
                const testEndPoint = this._settingsService.selectEndPointsForHost(settings, window.location.hostname)?.test;
                if (testEndPoint) {
                    const response = await fetch(testEndPoint, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        method: "get",
                    });
                    const status = response.status;
                    console.log('performAuthenticatedQuery status', status);
                    if (status !== 200) {
                        console.log('Error status', status);
                        this.responseData$.next({status, error: true})
                        return null;
                    }
                    const data = await response.json();
                    console.log('performAuthenticatedQuery data', data);
                    this.responseData$.next(data);
                    return data;
                }
            })
        ).subscribe();
    }

    /**
     * Performs a test query without jwt in the header.
     * @returns The returned data.
     */
    public async performUnauthenticatedQuery(): Promise<void> {
        console.log("performUnauthenticatedQuery");
        this._settingsService.settings$.pipe(
            take(1),
            tap((settings) => console.log('performUnauthenticatedQuery settings', settings)),
            filter(settings => !!settings),
            map(async settings => {
                const testEndPoint = this._settingsService.selectEndPointsForHost(settings, window.location.hostname)?.validation;
                const response = await fetch(testEndPoint, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "get",
                });
                const status = response.status;
                console.log('performUnauthenticatedQuery status', status);
                if (status !== 200) {
                    console.log('Error status', status);
                    this.responseData$.next({status, error: true})
                    return null;
                }
                const data = await response.json();
                console.log('performUnauthenticatedQuery data', data);
                this.responseData$.next(data);
                return data;
            })
        ).subscribe();
    }




}