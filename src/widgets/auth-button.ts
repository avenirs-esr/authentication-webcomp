
import { AuthController } from './../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';
import { Logger, LoggingManager, NoopLogger } from '../logging';



/**
 * Login / logout button.
 * @date 25/01/2024 - 16:13:49
 * @author A. Deman
 *
 * @export {AuthButton}
 * @class AuthButton
 * @typedef {AuthButton}
 * @extends {LitElement}
 */
@customElement('auth-button')
export class AuthButton extends LitElement {

  /** Logger for this instance. */
  private _logger: Logger = new LoggingManager().getLogger('AuthButton');

  /** Controller associated to this UI element */
  private _authController = new AuthController(this);

  /** Subscription to authenticated Observable. */
  private _subscription: Subscription | null = null;

  /** Initialization flag. */
  private _initialized = false;

  /** Authenticated flag. */
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


  /**
   * Logout callback.
   */
  private _onLogout(): void {
    console.log('AuthButton _onLogout');
    this._authController.logout();
  }

  /**
   * Loggin callback.
   */
  private _onLogin(): void {
    console.log('AuthButton _onLogin');
    this._authController.login();
  }

  /**
   * Lit callback.
   */
  connectedCallback(): void {
    this._logger.enter('connectedCallback')
    if (!this._subscription) {
      this._subscription = this._authController.authenticated$.pipe(
        tap(authenticated => this._logger
          .enter('connectedCallback')
          .debug('AuthButton authenticated ', authenticated)
          .leave()
        ),

      ).subscribe(authenticated => {
        this.initialized = true;
        this.authenticated = authenticated;
      });
    }
  }

  /**
   * Lit callback.
   */
  disconnectedCallback(): void {
    console.log('AuthButton disconnectedCallback');
    super.disconnectedCallback();
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  /**
   * Lit callback.
   */
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
