


export class AuthService {

private static _INSTANCE: AuthService;
    constructor() {
        if (AuthService._INSTANCE){
            return AuthService._INSTANCE;
        }
        console.log('AuthService');
        AuthService._INSTANCE = this;
    }
}