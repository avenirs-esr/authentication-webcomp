import { AuthEndPointsSettings } from './auth-end-points-settings';
export interface AuthRoutesSettings {
    local: AuthEndPointsSettings;
    dev: AuthEndPointsSettings;
    prod: AuthEndPointsSettings;
}