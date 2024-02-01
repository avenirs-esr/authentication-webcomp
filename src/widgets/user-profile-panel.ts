import { UserProfile } from '../models';

import { UserProfileController } from '../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';



/**
 * Display the user information.
 * @date 01/02/2024 - 16:46:26
 * @author A. Deman
 *
 * @export
 * @class UserProfilePanel
 * @typedef {UserProfilePanel}
 * @extends {LitElement}
 */
@customElement('user-profile-panel')
export class UserProfilePanel extends LitElement {

  /** Controller associated to this UI component. */
  private _userProfileController = new UserProfileController(this);

  /** Subscription to the user profile observable. */
  private _subscription: Subscription | null = null;

  /** Initialization flag. */
  private _initialized = false;

  /** User profile instance. */
  private _userProfile: UserProfile | null = null;

  static styles = css`
   :host {  
      display: flex;
      align-items: center;
      color: #474747;
  `;


  
  /**
   * Lit connected callback
   * @date 01/02/2024 - 16:49:10
   */
  connectedCallback(): void {
    console.log('UserProfilePanel connectedCallback');
    super.connectedCallback()
    if (!this._subscription) {
      this._subscription = this._userProfileController.profile$.pipe(
        tap(authenticationData => console.log('UserProfilePanel  authenticationData', authenticationData)),

      ).subscribe(
        userProfile => {
          this.initialized = true;
          this._userProfile = userProfile;
        })

      ;
    }
  }

  /**
   * Lit disconnected callback.
   * @date 01/02/2024 - 16:49:28
   */
  disconnectedCallback(): void {
    console.log('UserProfilePanel disconnectedCallback');
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }


  /**
   * Lit render method.
   * @date 01/02/2024 - 16:49:57
   *
   * @returns {*}
   */
  render() {
    console.log('UserProfilePanel Render _initialized', this._initialized);
    if (this._initialized) {
      console.log('UserProfilePanel Render');
      return   html`<div>${this._userProfile ? this._userProfile.givenName : 'Not authenticated'}</div>`
     
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
}
