
import { AuthController, TestQueryController, TestQueryResultDisplayerHost } from '../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';
import {observe} from '../directives';
import {asyncReplace} from 'lit/directives/async-replace.js';



/**
 * Query tester to check oidc integration.
 * @date 29/01/2024 - 14:07:04
 *
 * @export {QueryTester}
 * @class QueryTester
 * @typedef {QueryTester}
 * @extends {LitElement}
 */
@customElement('query-tester')
export class QueryTester extends LitElement implements TestQueryResultDisplayerHost {

  /** The controler associated to this widget. */
  private _testQueryController = new TestQueryController(this);

  /** The response data of the lat test query. */
  private _responseData: any | null;

  /** A subscription to the authenticated status. */
  //private _subscription: Subscription | null = null;

  /** Flag for the initialization. */
  // private _initialized = false;

  // /** Authentication flag. */
  // private _authenticated = false;

  private _auth = false;
  static styles = css`
    :host {
      display: block;
      color: var(--query-tester-text-color, #000);
    }
    button:not(:disabled) {
      cursor: pointer;
     }
    `;

  /**
   * Triggers an authenticated test query.
   */
  private _onTestAuthenticatedQuery(): void {
    console.log('QueryTester _onTestAuthenticatedQuery');
    this._testQueryController.performAuthenticatedQuery();
  }

  /**
   * Triggers an unauthenticated test query.
   */
  private _onTestUnauthenticatedQuery(): void {
    console.log('QueryTester _onTestUnauthenticatedQuery');
    this._testQueryController.performUnauthenticatedQuery();
  }

  /**
   * Notificatio for a new test query result.
   * @param data The response data to handle.
   */
  notifyTestQueryResponse(data: any): void {
    console.log('QueryTester notifyQueryResponse data', data);
    this._responseData = data;
    this.requestUpdate();
  }

  connectedCallback(): void {
    console.log('QueryTester connectedCallback');
    super.connectedCallback()
    this._testQueryController.authenticated$.pipe(
          tap(authenticated => console.log('QueryTester authenticated ', authenticated)),
  
        ).subscribe(authenticated => {
          this._auth = authenticated;
        });
      
    // if (!this._subscription) {
    //   this._subscription = this._testQueryController.authenticated$.pipe(
    //     tap(authenticated => console.log('QueryTester authenticated ', authenticated)),

    //   ).subscribe(authenticated => {
    //     this.initialized = true;
    //     this.authenticated = authenticated;
    //   });
    // }
  }


  disconnectedCallback(): void {
    console.log('QueryTester disconnectedCallback');
    super.disconnectedCallback();
    //   if(this._subscription) {
    //   this._subscription.unsubscribe();
    //   this._subscription = null;
    // }
  }

  render(): TemplateResult<1> {

    console.log('ObserveDirective QueryTester Render');
    const queryFragment = html`
      <div>
        <button @click="${this._onTestAuthenticatedQuery}" ?disabled="${!observe(this._testQueryController.authenticated$)}" >Test query with jwt</button>
        <button @click="${this._onTestUnauthenticatedQuery}">Test query without jwt</button>
      </div>`;
    const responseFragment = this._responseData ? html`
       <div>
        ${JSON.stringify(this._responseData)}
      </div> 
      ` : '';

    return html`
     <br/>
     value: ${observe(this._testQueryController.authenticated$)}<br/>
     v2 = ${this._auth}
     <br/>
      ${queryFragment}
      <!-- <div>
        QT
        <button @click="${this._onTestAuthenticatedQuery}">Test query with jwt</button>
        <button @click="${this._onTestUnauthenticatedQuery}">Test query without jwt</button>
      </div> -->
     ${responseFragment}
     <br/>
     value: ${observe(this._testQueryController.authenticated$)} => ${!observe(this._testQueryController.authenticated$)}<br/>
        `

  }

  // get initialized(): boolean {
  //   return this._initialized;
  // }

  // set initialized(initialized: boolean) {
  //   if (!!initialized != !!this._initialized) {
  //     this._initialized = !!initialized;
  //     if (this._initialized) {
  //       this.requestUpdate();
  //     }
  //   }
  // }

  // get authenticated(): boolean {
  //   return this._authenticated
  // }

  // set authenticated(authenticated: boolean) {
  //   if (this._authenticated !== authenticated) {
  //     this._authenticated = authenticated;

  //   }
  // }

}
