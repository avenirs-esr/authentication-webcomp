import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
//import { customElement, property } from 'lit/decorators.js';
import { AuthSettingsService } from './services';
import { AuthSettings } from './settings';

import './widgets';
import { Logger, LoggingManager, NoopLogger } from './logging';


/**
 * Web component for the authentication.
 * As the root of this web component it handles the settings initialization.
 * @date 01/02/2024 - 16:42:10
 * @author A. Deman.
 *
 * @export
 * @class AuthenticationWebcomp
 * @type {AuthenticationWebcomp}
 * @extends {LitElement}
 */
@customElement('authentication-webcomp')
export class AuthenticationWebcomp extends LitElement {

  private _logger : Logger | undefined;
  
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
      new AuthSettingsService().update(newVal);
     
      return true;
    }
  })
  settings?: AuthSettings;

    
  /**
   * Render method.
   * @date 01/02/2024 - 16:42:57
   *
   * @returns {*}
   */
  render(): any {
    this.logger.enter('render').debug('before render').leave();
    return html`
    <div class="main-container">
      <user-profile-panel></user-profile-panel>
      <auth-button></auth-button>
    </div>
    `;
  }

  private get logger():Logger {
    if (!this._logger){
      this._logger = new LoggingManager().getLogger('AuthenticationWebcomp');
    }
    return this._logger;
  }

  private set logger(logger: Logger){
    this._logger = logger;
  }
}

