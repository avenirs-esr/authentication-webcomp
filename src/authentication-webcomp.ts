import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AuthSettingsProvider } from './services';
import { AuthSettings } from './settings';
import './widgets';


@customElement('authentication-webcomp')
export class AuthenticationWebcomp extends LitElement {
  // static styles = css`
  //   :host {
  //     display: block;
  //     padding: 25px;
  //     color: var(--authentication-webcomp-text-color, #000);
  //   }
  //   `;


  /** Settings properties. The changes are propagated via the settings provider in
  the hasChanged hook.  */
  @property({
    attribute: false,
    hasChanged: (newVal: AuthSettings, oldVal: AuthSettings) => {
      if (newVal === oldVal) {
        return false
      }
      console.log('hasChanged', newVal);
      new AuthSettingsProvider().update(newVal);
      return true;
    }
  })
  settings?: AuthSettings

  constructor() {
    super();

  }

  render() {
    return html`
       <auth-button></auth-button>
    `;
  }

  settingsChanged() {
    console.log('authService - settingsChanged ', this.settings);
  }
}
