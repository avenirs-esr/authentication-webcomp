define("src/settings/auth-settings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/settings/default-auth-settings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_AUTH_SETTINGS = void 0;
    /**
     * Default settings for the authentication.
     */
    exports.DEFAULT_AUTH_SETTINGS = {
        jwtStorageKey: 'avenirs-jwt',
        baseURL: "http://localhost:3000",
        loginEndPoint: '/login',
        logoutEndPoint: '',
        redirectURI: ''
    };
});
// https://localhost/cas/login?service=https://localhost/node-api/cas-auth-callback
// https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20profile
define("src/settings/index", ["require", "exports", "tslib", "src/settings/auth-settings", "src/settings/default-auth-settings"], function (require, exports, tslib_1, auth_settings_1, default_auth_settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_1.__exportStar(auth_settings_1, exports);
    tslib_1.__exportStar(default_auth_settings_1, exports);
});
define("src/services/auth-settings-provider", ["require", "exports", "rxjs"], function (require, exports, rxjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthSettingsProvider = void 0;
    /**
        * Settings provider service.
        * Provides the an instance of Settings.
        */
    class AuthSettingsProvider {
        /** Singleton instance. */
        static _INSTANCE;
        /** settings. */
        settings$ = new rxjs_1.ReplaySubject(1);
        /**
        * Singleton constructor.
        * @param settings: The initial instance of settings (optional)
        * @returns the unique instance of this class.
        */
        constructor(settings) {
            if (!AuthSettingsProvider._INSTANCE) {
                AuthSettingsProvider._INSTANCE = this;
            }
            if (settings) {
                AuthSettingsProvider._INSTANCE.settings$.next(settings);
            }
            return AuthSettingsProvider._INSTANCE;
        }
        /**
         * Updates the settings.
         */
        update(settings) {
            this.settings$.next(settings);
        }
    }
    exports.AuthSettingsProvider = AuthSettingsProvider;
});
define("src/services/auth-service", ["require", "exports", "src/services/auth-settings-provider", "rxjs"], function (require, exports, auth_settings_provider_1, rxjs_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthService = void 0;
    /**
        * Authentication service.
        * This class is a singleton, the constructor will return the same instance.
        * 1. Try to retrieve the jwt from the URL.
        *       * If found: it is registered in the session storage.
        *       * If not found: try to find it in session storage.
        * 2. Iff there is a jwt it is validated.
        * 3. If there is a valid jwt, the user is authenticated.
        * 4. If not redirect to the oidc provider to retrieve a jwt.
        */
    class AuthService {
        /** Singleton instance. */
        static _INSTANCE;
        /** Authentication settings. */
        _settingsProvider = new auth_settings_provider_1.AuthSettingsProvider();
        /** Authenticated status observable. */
        authenticated$ = new rxjs_2.ReplaySubject(1);
        /** The active jwt  observable. */
        jwt$ = new rxjs_2.ReplaySubject(1);
        /** Authentication data */
        authenticationData$ = new rxjs_2.ReplaySubject(1);
        /**
         * Singleton constructor.
         * @returns the unique instance of this class.
         */
        constructor() {
            if (!AuthService._INSTANCE) {
                this._initializeJWT();
                AuthService._INSTANCE = this;
            }
            return AuthService._INSTANCE;
        }
        /**
         * Trye to fectch a JWT.
         * @param onlySessionStorage Flag to determine if the JWT can be retrieved from the location.
         */
        _initializeJWT(onlySessionStorage = false) {
            this._settingsProvider.settings$.pipe((0, rxjs_2.filter)(settings => !!settings?.jwtStorageKey), (0, rxjs_2.take)(1)).subscribe(settings => {
                let authenticated = false;
                // Flag to determine if an invalid jwk has to be removed from storage.
                let cleanStorageFlag = false;
                let jwt = '';
                let authenticationData = null;
                if (!onlySessionStorage) {
                    const urlTokens = window.location.href.split('#');
                    console.log('AuthService _initializeJWT urlTokens', urlTokens);
                    const newLocation = urlTokens?.[0];
                    if (newLocation !== window.location.href) {
                        console.log('AuthService _initializeJWT newLocation', newLocation);
                        history.replaceState({}, '', newLocation);
                    }
                    const urlParams = new URLSearchParams(urlTokens?.[1]);
                    jwt = urlParams.get('access_token') || '';
                    console.log('AuthService _initializeJWT jwt', jwt);
                }
                if (!jwt) {
                    jwt = sessionStorage.getItem(settings.jwtStorageKey) || '';
                    cleanStorageFlag = true; // If the jwt is not valid it has to be removed from session storage.
                }
                if (jwt) {
                    const validationEndpoint = `http://${this.backend}/node-api/cas-auth-validate`;
                    this._introspect(validationEndpoint, jwt)
                        .then(data => {
                        console.log('_initializeJWT data', authenticationData);
                        authenticationData = data?.profile;
                        console.log('_initializeJWT authenticationData', authenticationData);
                        authenticated = data?.active;
                        console.log('_initializeJWT data', authenticationData);
                        console.log('_initializeJWT authenticated', authenticated);
                    })
                        .catch(err => console.log('AuthService _initializeJWT err', err))
                        .finally(() => {
                        if (authenticated) {
                            sessionStorage.setItem(settings.jwtStorageKey, jwt);
                        }
                        else if (cleanStorageFlag) {
                            sessionStorage.removeItem(settings.jwtStorageKey);
                        }
                        this.authenticated$.next(authenticated);
                        this.jwt$.next(jwt);
                        console.log('AuthService _initializeJWT authenticationData$ emetting', authenticationData);
                        this.authenticationData$.next(authenticationData);
                    });
                }
                else {
                    console.log('AuthService _initializeJWT authenticated', authenticated);
                    this.authenticated$.next(authenticated);
                    this.jwt$.next('');
                    console.log('AuthService _initializeJWT authenticationData$ emetting null');
                    this.authenticationData$.next(null);
                }
            });
        }
        /**
         * Introspects a JWT.
         * @param url The introspection end point.
         * @param jwt The JWT to introspect.
         * @returns The introspection data.
         */
        async _introspect(url, jwt) {
            console.log('_introspect url', url);
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "x-authorization": jwt
                },
                method: "post",
            });
            const status = response.status;
            console.log('_introspect status', status);
            if (status !== 200) {
                console.log('Error status', status);
                return null;
            }
            const data = response.json();
            console.log('_introspect data', data);
            return data;
        }
        login() {
            this._settingsProvider.settings$.pipe((0, rxjs_2.filter)(settings => !!settings?.jwtStorageKey), (0, rxjs_2.take)(1)).subscribe(settings => {
                console.log('AuthService login, settings', settings);
                const url = settings.baseURL + settings.loginEndPoint;
                console.log('AuthService login, url', url);
                //sessionStorage.setItem(settings.jwtStorageKey, 'myToken');
                window.location.href = `https://${this.backend}/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost/node-api/cas-auth-callback&response_type=code&scope=openid%20email%20profile`;
                //window.location.href = "https://localhost/cas/oidc/oidcAuthorize?client_id=APIMClientId&redirect_uri=https://localhost:8000/demo&response_type=code&scope=openid%20profile"
                //  localStorage.setItem(settings?.jwtStorageKey, 'true');
                //  this.authenticated$.next(true);
            });
        }
        logout() {
            this._settingsProvider.settings$.pipe((0, rxjs_2.filter)(settings => !!settings.jwtStorageKey), (0, rxjs_2.take)(1)).subscribe(settings => {
                console.log('AuthService logout');
                const url = settings.baseURL + settings.logoutEndPoint;
                console.log('AuthService logout, url', url);
                sessionStorage.removeItem(settings.jwtStorageKey);
                window.location.href = `https://${this.backend}/cas/oidc/oidcLogout?service=https://localhost/node-api/cas-auth-callback`;
            });
        }
        get backend() {
            const hostname = window.location.hostname;
            return hostname === 'localhost' ? 'localhost' : 'avenirs-apache';
        }
    }
    exports.AuthService = AuthService;
});
define("src/services/index", ["require", "exports", "tslib", "src/services/auth-service", "src/services/auth-settings-provider"], function (require, exports, tslib_2, auth_service_1, auth_settings_provider_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_2.__exportStar(auth_service_1, exports);
    tslib_2.__exportStar(auth_settings_provider_2, exports);
});
define("src/controllers/auth-controller", ["require", "exports", "src/services/index"], function (require, exports, services_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthController = void 0;
    /**
     * Authentication controler.
     * Makes the junction beetween authentication widgets and the authentication service.
     */
    class AuthController {
        host;
        authService;
        constructor(host) {
            (this.host = host).addController(this);
            this.authService = new services_1.AuthService();
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
        get authenticated$() {
            return this.authService.authenticated$;
        }
        login() {
            console.log('AuthController login');
            this.authService.login();
        }
        logout() {
            console.log('AuthController logout');
            this.authService.logout();
        }
    }
    exports.AuthController = AuthController;
});
define("src/models/user-profile", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/models/index", ["require", "exports", "tslib", "src/models/user-profile"], function (require, exports, tslib_3, user_profile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_3.__exportStar(user_profile_1, exports);
});
define("src/controllers/user-profile-controller", ["require", "exports", "rxjs", "src/services/index"], function (require, exports, rxjs_3, services_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserProfileController = void 0;
    /**
     * Manages the user profile widgets.
     */
    class UserProfileController {
        host;
        authService;
        profile$;
        constructor(host) {
            (this.host = host).addController(this);
            this.authService = new services_2.AuthService();
            this.profile$ = this.authService.authenticationData$.pipe((0, rxjs_3.tap)(authenticationData => console.log('UserProfileController authenticationData', authenticationData)), (0, rxjs_3.map)(authenticationData => {
                let userProfil = null;
                if (authenticationData) {
                    userProfil = {
                        uid: authenticationData.id,
                        givenName: authenticationData.attributes?.given_name,
                        familyName: authenticationData.attributes?.family_name,
                        email: authenticationData.attributes?.email
                    };
                }
                return userProfil;
            }));
        }
        hostConnected() {
        }
        hostDisconnected() {
        }
    }
    exports.UserProfileController = UserProfileController;
});
define("src/controllers/index", ["require", "exports", "tslib", "src/controllers/auth-controller", "src/controllers/user-profile-controller"], function (require, exports, tslib_4, auth_controller_1, user_profile_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_4.__exportStar(auth_controller_1, exports);
    tslib_4.__exportStar(user_profile_controller_1, exports);
});
define("src/widgets/auth-button", ["require", "exports", "tslib", "src/controllers/index", "lit", "lit/decorators.js", "rxjs"], function (require, exports, tslib_5, controllers_1, lit_1, decorators_js_1, rxjs_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthButton = void 0;
    let AuthButton = class AuthButton extends lit_1.LitElement {
        _authController = new controllers_1.AuthController(this);
        _subscription = null;
        _initialized = false;
        _authenticated = false;
        static styles = (0, lit_1.css) `
    :host {
      display: block;
      color: var(--authentication-webcomp-text-color, #000);
    }
    button {
      cursor: pointer;
     }
    `;
        _onLogout() {
            console.log('AuthButton _onLogout');
            this._authController.logout();
        }
        _onLogin() {
            console.log('AuthButton _onLogin');
            this._authController.login();
        }
        connectedCallback() {
            console.log('AuthButton connectedCallback');
            super.connectedCallback();
            if (!this._subscription) {
                this._subscription = this._authController.authenticated$.pipe((0, rxjs_4.tap)(authenticated => console.log('AuthButton authenticated ', authenticated))).subscribe(authenticated => {
                    this.initialized = true;
                    this.authenticated = authenticated;
                });
            }
        }
        disconnectedCallback() {
            console.log('AuthButton disconnectedCallback');
            if (this._subscription) {
                this._subscription.unsubscribe();
                this._subscription = null;
            }
        }
        render() {
            if (this._initialized) {
                console.log('AuthButton Render');
                return this.authenticated ? (0, lit_1.html) `<button @click="${this._onLogout}">logout</button>` : (0, lit_1.html) `<button @click="${this._onLogin}">login</button>`;
            }
        }
        get initialized() {
            return this._initialized;
        }
        set initialized(initialized) {
            if (!!initialized != !!this._initialized) {
                this._initialized = !!initialized;
                if (this._initialized) {
                    this.requestUpdate();
                }
            }
        }
        get authenticated() {
            return this._authenticated;
        }
        set authenticated(authenticated) {
            if (this._authenticated !== authenticated) {
                this._authenticated = authenticated;
            }
        }
    };
    exports.AuthButton = AuthButton;
    exports.AuthButton = AuthButton = tslib_5.__decorate([
        (0, decorators_js_1.customElement)('auth-button')
    ], AuthButton);
});
define("src/widgets/user-profile-panel", ["require", "exports", "tslib", "src/controllers/index", "lit", "lit/decorators.js", "rxjs"], function (require, exports, tslib_6, controllers_2, lit_2, decorators_js_2, rxjs_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserProfilePanel = void 0;
    /**
     * Displays the user login.
     */
    let UserProfilePanel = class UserProfilePanel extends lit_2.LitElement {
        _userProfileController = new controllers_2.UserProfileController(this);
        _subscription = null;
        _initialized = false;
        _userProfile = null;
        static styles = (0, lit_2.css) `
   :host {  
      display: flex;
      align-items: center;
      color: #474747;
  `;
        connectedCallback() {
            console.log('UserProfilePanel connectedCallback');
            super.connectedCallback();
            if (!this._subscription) {
                this._subscription = this._userProfileController.profile$.pipe((0, rxjs_5.tap)(authenticationData => console.log('UserProfilePanel  authenticationData', authenticationData))).subscribe(userProfile => {
                    this.initialized = true;
                    this._userProfile = userProfile;
                });
            }
        }
        disconnectedCallback() {
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
                return (0, lit_2.html) `<div>${this._userProfile ? this._userProfile.givenName : 'Not authenticated'}</div>`;
            }
        }
        get initialized() {
            return this._initialized;
        }
        set initialized(initialized) {
            if (!!initialized != !!this._initialized) {
                this._initialized = !!initialized;
                if (this._initialized) {
                    this.requestUpdate();
                }
            }
        }
    };
    exports.UserProfilePanel = UserProfilePanel;
    exports.UserProfilePanel = UserProfilePanel = tslib_6.__decorate([
        (0, decorators_js_2.customElement)('user-profile-panel')
    ], UserProfilePanel);
});
define("src/widgets/index", ["require", "exports", "tslib", "src/widgets/auth-button", "src/widgets/user-profile-panel"], function (require, exports, tslib_7, auth_button_1, user_profile_panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_7.__exportStar(auth_button_1, exports);
    tslib_7.__exportStar(user_profile_panel_1, exports);
});
define("src/authentication-webcomp", ["require", "exports", "tslib", "lit", "lit/decorators.js", "src/services/index", "src/widgets/index"], function (require, exports, tslib_8, lit_3, decorators_js_3, services_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthenticationWebcomp = void 0;
    let AuthenticationWebcomp = class AuthenticationWebcomp extends lit_3.LitElement {
        static styles = (0, lit_3.css) `
  
    .main-container {
      display:flex;
      gap: 1em;
      padding: 1em;
    }
    `;
        /** Settings properties. The changes are propagated via the settings provider in
        the hasChanged hook.  */
        settings;
        constructor() {
            super();
        }
        render() {
            return (0, lit_3.html) `
    <div class="main-container">
      <user-profile-panel></user-profile-panel>
      <auth-button></auth-button>
    </div>
    `;
        }
    };
    exports.AuthenticationWebcomp = AuthenticationWebcomp;
    tslib_8.__decorate([
        (0, decorators_js_3.property)({
            attribute: false,
            hasChanged: (newVal, oldVal) => {
                if (newVal === oldVal) {
                    return false;
                }
                new services_3.AuthSettingsProvider().update(newVal);
                return true;
            }
        })
    ], AuthenticationWebcomp.prototype, "settings", void 0);
    exports.AuthenticationWebcomp = AuthenticationWebcomp = tslib_8.__decorate([
        (0, decorators_js_3.customElement)('authentication-webcomp')
    ], AuthenticationWebcomp);
});
define("src/index", ["require", "exports", "src/authentication-webcomp"], function (require, exports, authentication_webcomp_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthenticationWebcomp = void 0;
    Object.defineProperty(exports, "AuthenticationWebcomp", { enumerable: true, get: function () { return authentication_webcomp_js_1.AuthenticationWebcomp; } });
});
define("test/authentication-webcomp.test", ["require", "exports", "lit", "@open-wc/testing", "../src/authentication-webcomp_ts"], function (require, exports, lit_4, testing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('AuthenticationWebcomp', () => {
        it('passes the a11y audit', async () => {
            const el = await (0, testing_1.fixture)((0, lit_4.html) `<authentication-webcomp></authentication-webcomp>`);
            await (0, testing_1.expect)(el).shadowDom.to.be.accessible();
        });
    });
});
//# sourceMappingURL=out.js.map