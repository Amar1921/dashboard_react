// services/TokenService.js
export default class TokenService {
    static getToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    static setToken(token, rememberMe = false) {
        if (rememberMe) {
            localStorage.setItem('authToken', token);
        } else {
            sessionStorage.setItem('authToken', token);
        }
    }

    static removeToken() {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
    }

    static isValidToken(token) {
        if (!token) return false;

        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return false;

        try {
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            const currentTime = Math.floor(Date.now() / 1000);

            return payload.exp && payload.exp > currentTime;
        } catch (e) {
            return false;
        }
    }

    static getTokenPayload(token = null) {
        const tokenToDecode = token || this.getToken();
        if (!tokenToDecode) return null;

        try {
            const payloadBase64 = tokenToDecode.split('.')[1];
            if (!payloadBase64) return null;

            const payloadJson = atob(payloadBase64);
            return JSON.parse(payloadJson);
        } catch (e) {
            return null;
        }
    }

    static getTokenExpiration(token = null) {
        const payload = this.getTokenPayload(token);
        return payload?.exp ? payload.exp * 1000 : null;
    }

    static getTimeUntilExpiration(token = null) {
        const expiration = this.getTokenExpiration(token);
        if (!expiration) return null;

        const currentTime = Date.now();
        return expiration - currentTime;
    }

    static willExpireSoon(thresholdMinutes = 5, token = null) {
        const timeUntilExpiration = this.getTimeUntilExpiration(token);
        if (timeUntilExpiration === null) return true;

        const thresholdMs = thresholdMinutes * 60 * 1000;
        return timeUntilExpiration <= thresholdMs;
    }

    static isAuthenticated() {
        const token = this.getToken();
        return token && this.isValidToken(token);
    }

    static getStoredTokenType() {
        if (localStorage.getItem('authToken')) {
            return 'localStorage';
        } else if (sessionStorage.getItem('authToken')) {
            return 'sessionStorage';
        }
        return null;
    }

    static clearAllAuthData() {
        this.removeToken();
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('refreshToken');
    }

    static refreshToken(newToken, rememberMe = null) {
        const currentStorageType = this.getStoredTokenType();

        if (rememberMe === null) {
            rememberMe = currentStorageType === 'localStorage';
        }

        this.removeToken();
        this.setToken(newToken, rememberMe);
    }

    static getTokenShortInfo() {
        const token = this.getToken();
        if (!token) return null;

        const payload = this.getTokenPayload(token);
        if (!payload) return null;

        return {
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
            issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
            subject: payload.sub || null,
            isValid: this.isValidToken(token),
            storageType: this.getStoredTokenType()
        };
    }
}