
import { AuthController, TestQueryController, TestQueryResultDisplayerHost } from '../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';
import {rxDisable} from '../directives';
import {asyncReplace} from 'lit/directives/async-replace.js';
import { DirectiveResult } from 'lit/async-directive';



/**
 * Query tester to check oidc integration.
 * @date 29/01/2024 - 14:07:04
 * @author A. Deman.
 *
 * @export {QueryTester}
 * @class QueryTester
 * @type {QueryTester}
 * @extends {LitElement}
 */
@customElement('query-tester')
export class QueryTester extends LitElement implements TestQueryResultDisplayerHost {

  /** The controler associated to this widget. */
  private _testQueryController = new TestQueryController(this);

  /** The response data of the lat test query. */
  private _responseData: any | null;

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
   * Notification for a new test query result.
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
    
  }


  disconnectedCallback(): void {
    console.log('QueryTester disconnectedCallback');
    super.disconnectedCallback();
  
  }

   render() {

    console.log('ObserveDirective QueryTester Render');
    
    const queryFragment = html`
      <div>
        <button @click="${this._onTestAuthenticatedQuery}"  ${rxDisable(this._testQueryController.authenticated$, true)} >Test query with jwt</button>
        <button @click="${this._onTestUnauthenticatedQuery}">Test query without jwt</button>
      </div>`;
    const responseFragment = this._responseData ? html`
       <div>
        ${JSON.stringify(this._responseData)}
      </div> 
      ` : '';

    return html`
     <br/>
      
     <br/>
      ${queryFragment}
      <!-- <div>
        QT
        <button @click="${this._onTestAuthenticatedQuery}">Test query with jwt</button>
        <button @click="${this._onTestUnauthenticatedQuery}">Test query without jwt</button>
      </div> -->
     ${responseFragment}
     <br/>
     
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
