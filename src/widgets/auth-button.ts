
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, tap } from 'rxjs';
import { Logger, LoggingManager } from '../logging';
import { AuthController } from './../controllers';




/**
 * Login / logout button.
 * @date 25/01/2024 - 16:13:49
 * @author A. Deman
 *
 * @export {AuthButton}
 * @class AuthButton
 * @type {AuthButton}
 * @extends {LitElement}
 */
@customElement('auth-button')
export class AuthButton extends LitElement {

  /** Logger for this instance. */
  private _logger: Logger = new LoggingManager().getLogger('AuthButton');

  /** Controller associated to this UI element */
  private _authController = new AuthController(this);

  /** Subscription to authenticated status Observable. */
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
   super.connectedCallback();
    if (!this._subscription) {
      this._subscription = this._authController.authenticated$.pipe(
        tap(authenticated =>  this._logger
          .enter('connectedCallback')
          .debug('AuthButton authenticated ', authenticated)
          .leave()
        ),

      ).subscribe(authenticated => {
        this.authenticated = authenticated;
        this.initialized = true;
        this._logger.enter('connectedCallback').debug('this.authenticated', this.authenticated, 'initialized', this.initialized); 
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
    console.log('AuthButton render');
    this._logger.enter('render').debug('this_initialized', this._initialized);
    if (this._initialized) {
      console.log('AuthButton Render');
      return this.authenticated ? html`<button @click="${this._onLogout}">logout</button>` : html`<button @click="${this._onLogin}">login</button>`
    }
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(initialized: boolean) {
    this._logger.enter('set initialized').debug('initialized', initialized);
    if (!!initialized != !!this._initialized) {
      this._initialized = !!initialized;
      this._logger.debug('this._initialized', this._initialized);
      if (this._initialized) {
        this._logger.debug('beefore this.requestUpdate').leave();
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
