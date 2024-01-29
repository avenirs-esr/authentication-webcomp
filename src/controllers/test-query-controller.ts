import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { AuthService, TestQueryService } from '../services';
import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Interface for the widget used to display the result of the test query.
 */
export interface TestQueryResultDisplayerHost {


  /**
   * Notify a query response.
   * @param data the data returned by the backend for the test query.
   */
  notifyTestQueryResponse(data: any): void;

}

/**
 * Test query controler.
 * Used to check the oidc integration.
 */
export class TestQueryController implements ReactiveController {

  /** Widget associated to this controler. */
    host: ReactiveControllerHost & TestQueryResultDisplayerHost;

    /** The underlying service used to perform the test queries. */
    private _testQueryService = new TestQueryService();

    /** Subscription for the response data. */
    private _subscription: Subscription | null = null;

    /** Authentication service. */
    private _authService = new AuthService();
   
    /**
     * Builds an instance of controler.
     * @param host The widget handled by this controler. It should implement the TestQueryResultDisplayerHost interface
     * to handle the results of test queries.
     */
    constructor(host: ReactiveControllerHost & TestQueryResultDisplayerHost) {
        (this.host = host).addController(this);
        this._testQueryService = new TestQueryService();
    }

    /**
     * ReactiveController method.
     */
    hostConnected() {
      this._subscription =  this._testQueryService.responseData$.subscribe(data => this.host.notifyTestQueryResponse(data));
    }
    
    /**
     * ReactiveController method.
     */
    hostDisconnected() {
      if (this._subscription){
        this._subscription.unsubscribe();
        this._subscription = null;
      }
    }

    /**
     * Performs an authenticated query (i.e.: with jwt).
     * @returns The result of the query.
     */
    performAuthenticatedQuery():Promise<any> {
      return this._testQueryService.performAuthenticatedQuery();
    }

    /**
     * Performs an unauthenticated query (i.e.: with jwt).
     * @returns The result of the query.
     */
    performUnauthenticatedQuery():Promise<any> {
      return this._testQueryService.performUnauthenticatedQuery();
    }

    /**
     * Observable for the authentication status.
     * @return An observable of the authentication status.
     */
    get authenticated$(): Observable<boolean>{
      return this._authService.authenticated$;
    }
}
