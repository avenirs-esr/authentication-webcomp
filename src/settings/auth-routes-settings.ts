import { AuthEndPointsSettings } from './auth-end-points-settings';


/**
 * Route setttings for local, dev and production contexts.
 * @date 01/02/2024 - 16:39:47
 * @author A. Deman.
 *
 * @export
 * @interface AuthRoutesSettings
 * @type {AuthRoutesSettings}
 */
export interface AuthRoutesSettings {
    local: AuthEndPointsSettings;
    dev: AuthEndPointsSettings;
    prod: AuthEndPointsSettings;
}