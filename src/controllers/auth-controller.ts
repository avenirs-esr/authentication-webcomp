import { Observable } from 'rxjs';
import { AuthService } from './../services/';
import { ReactiveController, ReactiveControllerHost } from "lit";


/**
 * Authentication controler.
 * Makes the junction beetween authentication widgets and the authentication service.
 */
export class AuthController implements ReactiveController {
    host: ReactiveControllerHost;
    authService: AuthService
   

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
        this.authService = new AuthService();
        console.log('AUTH CONTROLLER');
    }

    hostConnected() {
        // Start a timer when the host is connected
        // this._timerID = setInterval(() => {
        //   this.value = new Date();
        //   // Update the host with new value
        //  this.host.requestUpdate();
        // }, this.timeout);
      }
      hostDisconnected() {
        // Clear the timer when the host is disconnected
        // clearInterval(this._timerID);
        // this._timerID = undefined;
      }

      get authenticated$(): Observable<boolean> {
        return this.authService.authenticated$;
      }

      login(){
        console.log('AuthController login');
        this.authService.login();
      }
      
      logout(){
        console.log('AuthController logout');
        this.authService.logout();
      }

}
