import { ReactiveController, ReactiveControllerHost } from "lit";
import { Observable } from 'rxjs';
import { LoggingManager } from '../logging';
import { NoopLogger } from '../logging';
import { AuthService } from './../services/';


/**
 * Authentication controller. 
 * Makes the junction between the ui component and the service.
 * @date 01/02/2024 - 16:08:48
 * @author A. Deman
 *
 * @export
 * @class AuthController
 * @typedef {AuthController}
 * @implements {ReactiveController}
 */
export class AuthController implements ReactiveController {
  
  /** Logger associated to this class. */
  private _logger = new NoopLogger();

  /** The host connected to this controller. */
  host: ReactiveControllerHost;

  /** Authentication service. */
  authService: AuthService;

  /**
   * Creates an instance of AuthController.
   * @date 01/02/2024 - 15:43:10
   *
   * @constructor
   * @param {ReactiveControllerHost} host The host connected this controller.
   */
  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.authService = new AuthService();

    this._logger = new LoggingManager().getLogger('AuthController')
    
    
  }

  hostConnected() {
  }

  hostDisconnected() {
  }

  
  /**
   * Observable of authentication state.
   * @date 01/02/2024 - 15:43:56
   *
   * @readonly
   * @type {Observable<boolean>}
   */
  get authenticated$(): Observable<boolean> {
    return this.authService.authenticated$;
  }
  
  /**
   * Login action.
   * @date 01/02/2024 - 15:44:18
   */
  login() {
    this._logger.debug('login');
    this.authService.login();
  }

  
  /**
   * Logout action.
   * @date 01/02/2024 - 16:03:53
   */
  logout() {
    this._logger.debug('logout');
    this.authService.logout();
  }

}
