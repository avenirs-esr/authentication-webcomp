
import { AuthController } from './../controllers';
import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('auth-button')
export class AuthButton extends LitElement {

  private authController = new AuthController(this);

  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--authentication-webcomp-text-color, #000);
    }
    `;



  render() {
    return html`
      <button>login</button>
    `;
  }
}
