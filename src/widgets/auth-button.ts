
import { AuthController } from './../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';


@customElement('auth-button')
export class AuthButton extends LitElement {

  private _authController = new AuthController(this);
  private _subscription: Subscription | null = null;
  private _authenticated = false;

  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--authentication-webcomp-text-color, #000);
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
        
      ).subscribe(authenticated => this.authenticated = authenticated);
    }
  }

  disconnectedCallback(): void {
    console.log('AuthButton disconnectedCallback');
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  render(): TemplateResult {

    console.log('AuthButton Render');
    return this.authenticated ? html`<button @click="${this._onLogout}">logout</button>` : html`<button @click="${this._onLogin}">login</button>`

  }

  get authenticated(): boolean {
    return this._authenticated
  }

  set authenticated(authenticated: boolean) {
    if (this._authenticated !== authenticated) {
      this._authenticated = authenticated;
      this.requestUpdate();
    }
  }
}
