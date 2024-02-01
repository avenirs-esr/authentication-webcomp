

import { ReactiveController, ReactiveControllerHost } from "lit";
import { Observable, map, tap } from 'rxjs';
import { UserProfile } from '../models/';
import { AuthService } from '../services';
import { LoggingManager, NoopLogger } from "../logging";


/**
 * Controller for the user profile widgets.
 * @date 01/02/2024 - 16:10:21
 * @author A. Deman
 *
 * @export 
 * @class UserProfileController
 * @typedef {UserProfileController}
 * @implements {ReactiveController}
 */
export class UserProfileController implements ReactiveController {

  /** Logger for this instance. */
  private _logger = new NoopLogger()

  /** The associated UI element. */
  host: ReactiveControllerHost;

  /** Authentication service. */
  authService: AuthService;

  /** User profile Observable. */
  profile$: Observable<UserProfile | null>;
  
  /**
   * Creates an instance of UserProfileController.
   * @date 01/02/2024 - 16:53:52
   *
   * @constructor
   * @param {ReactiveControllerHost} host The ui element controlled by this instance.
   */
  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this._logger = new LoggingManager().getLogger('UserProfileController');
    this.authService = new AuthService();

    this.profile$ =  this.authService.authenticationData$.pipe(
      tap(authenticationData => this._logger.debug('UserProfileController authenticationData', authenticationData)),
      map(authenticationData => {
        let userProfil: UserProfile | null = null;
        
        if (authenticationData) {
          userProfil = {
            uid: authenticationData.id,
            givenName: authenticationData.attributes?.given_name,
            familyName: authenticationData.attributes?.family_name,
            email: authenticationData.attributes?.email
          }
        }

        return userProfil;
      })
    );
  }
  
  /**
   * Lit method.
   * @date 01/02/2024 - 16:54:20
   */
  hostConnected() {
  }
  
  /**
   * Lit method.
   * @date 01/02/2024 - 16:54:33
   */
  hostDisconnected() {
  }
}
