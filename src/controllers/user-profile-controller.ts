import { ReactiveController, ReactiveControllerHost } from "lit";
import { Observable, filter, map, mergeMap, tap } from 'rxjs';
import { UserProfile } from '../models/';
import { AuthService } from '../services';


/**
 * Manages the user profile widgets.
 */
export class UserProfileController implements ReactiveController {
  host: ReactiveControllerHost;
  authService: AuthService;
  profile$: Observable<UserProfile | null>;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.authService = new AuthService();

    this.profile$ =  this.authService.authenticationData$.pipe(
      tap(authenticationData => console.log('UserProfileController authenticationData', authenticationData)),
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

    )
  }

  hostConnected() {
  }

  hostDisconnected() {
  }
}
