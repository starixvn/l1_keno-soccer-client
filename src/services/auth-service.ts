import { SSOResponse } from "sc-user-service-client/dist/auth";

import {
    getLocalStorageItem,
    localStorageKeys,
    removeLocalStorageItem,
    storeLocalStorageItem,
} from "../common/local-storage";
import { UserClientCommunication } from "./user-client-communication";

const { settings: settingsService, auth: authService } = UserClientCommunication.getUserClientInstance();

export const checkUM = async () => {
    const settings = await settingsService.getSettings();

    return settings.isUM;
};

export const sso = async (token: string) => {
    const userSession = await authService.sso(token, 2);

    if (userSession && userSession.isAuthenticated) {
        storeLocalStorageItem<SSOResponse>(localStorageKeys.session, userSession);
    }

    return userSession;
};

export const verifySession = async () => {
    const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);

    if (!userSession) {
        return null;
    }

    const verifySessionResponse = await authService.verifySession(userSession?.ss, userSession?.username);

    if (verifySessionResponse && verifySessionResponse.isSuccessful) {
        return userSession;
    }

    return null;
};

export const clearSession = () => removeLocalStorageItem(localStorageKeys.session);

export const reCheckIn = async () => {
    const userSession = getLocalStorageItem<SSOResponse>(localStorageKeys.session);
    return authService.reCheckIn(userSession?.ss, userSession?.username);
};
