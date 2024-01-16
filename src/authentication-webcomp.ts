import { AuthService } from './services/auth-service';
import { AuthController } from './controllers';
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './widgets'


@customElement('authentication-webcomp')
export class AuthenticationWebcomp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--authentication-webcomp-text-color, #000);
    }
    `;

private authService = new AuthService();



  constructor() {
    super();
   
  }

  render() {
    return html`
       <auth-button></auth-button>
    `;
  }
}
