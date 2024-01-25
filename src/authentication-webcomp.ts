import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AuthSettingsProvider } from './services';
import { AuthSettings } from './settings';
import './widgets';


@customElement('authentication-webcomp')
export class AuthenticationWebcomp extends LitElement {
  static styles = css`
  
    .main-container {
      display:flex;
      gap: 1em;
      padding: 1em;
    }
    `;


  /** Settings properties. The changes are propagated via the settings provider in
  the hasChanged hook.  */
  @property({
    attribute: false,
    hasChanged: (newVal: AuthSettings, oldVal: AuthSettings) => {
      if (newVal === oldVal) {
        return false
      }
      new AuthSettingsProvider().update(newVal);
      return true;
    }
  })
  settings?: AuthSettings;

  constructor() {
    super();
   
  
  

  }

  render() {
    console.log('RENDER WEBCOMP')

    return html`

  
    <div class="main-container">
      <user-profile-panel></user-profile-panel>
      <auth-button></auth-button>
    </div>
    `;
  }
}
