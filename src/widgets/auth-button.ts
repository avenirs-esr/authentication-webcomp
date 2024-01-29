
import { AuthController } from './../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';



/**
 * Login / logout button.
 * @date 25/01/2024 - 16:13:49
 *
 * @export {AuthButton}
 * @class AuthButton
 * @typedef {AuthButton}
 * @extends {LitElement}
 */
@customElement('auth-button')
export class AuthButton extends LitElement {

  private _authController = new AuthController(this);
  private _subscription: Subscription | null = null;
  private _initialized = false;
  private _authenticated = false;

  static styles = css`
    :host {
      display: block;
      color: var(--auth-button-text-color, #000);
    }
    button {
      cursor: pointer;
     }
    `;

  private _onLogout(): void {
    console.log('AuthButton _onLogout');
    this._authController.logout();
  }

  private _onLogin(): void {
    console.log('AuthButton _onLogin');
    this._authController.login();
  }

  connectedCallback(): void {
    console.log('AuthButton connectedCallback');
    super.connectedCallback()
    if (!this._subscription) {
      this._subscription = this._authController.authenticated$.pipe(
        tap(authenticated => console.log('AuthButton authenticated ', authenticated)),

      ).subscribe(authenticated => {
        this.initialized = true;
        this.authenticated = authenticated;
      });
    }
  }

  disconnectedCallback(): void {
    console.log('AuthButton disconnectedCallback');
    super.disconnectedCallback();
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  render() {
    if (this._initialized) {
      console.log('AuthButton Render');
      return this.authenticated ? html`<button @click="${this._onLogout}">logout</button>` : html`<button @click="${this._onLogin}">login</button>`
    }
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(initialized: boolean) {
    if (!!initialized != !!this._initialized) {
      this._initialized = !!initialized;
      if (this._initialized) {
        this.requestUpdate();
      }
    }
  }

  get authenticated(): boolean {
    return this._authenticated
  }

  set authenticated(authenticated: boolean) {
    if (this._authenticated !== authenticated) {
      this._authenticated = authenticated;

    }
  }
}
