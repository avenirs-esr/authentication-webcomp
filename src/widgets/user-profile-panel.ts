import { UserProfile } from '../models';

import { UserProfileController } from '../controllers';
import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Subscription, map, tap } from 'rxjs';


/**
 * Displays the user login.
 */
@customElement('user-profile-panel')
export class UserProfilePanel extends LitElement {

  private _userProfileController = new UserProfileController(this);
  private _subscription: Subscription | null = null;
  private _initialized = false;
  private _userProfile: UserProfile | null = null;

  static styles = css`
   :host {  
      display: flex;
      align-items: center;
      color: #474747;
  `;


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

  disconnectedCallback(): void {
    console.log('UserProfilePanel disconnectedCallback');
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

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
