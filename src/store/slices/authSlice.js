// store/slices/authSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL_BASE || 'http://localhost:8000';

// Helper pour nettoyer le storage
export const clearAuthStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
};

// Fonction pour logger la déconnexion
const logLogout = async (userEmail) => {
    try {
        await axios.post(`${BASE_URL}/log-logout`, {
            email: userEmail,
            logoutTime: new Date().toISOString(),
            reason: 'user_initiated'
        });
    } catch (error) {
        console.warn('Erreur lors du logging de déconnexion:', error);
    }
};

// Fonction pour obtenir les informations utilisateur (si nécessaire)
export const getUserInfo = async () => {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
            timeout: 5000
        });
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            ip: userIp,
            country: 'pending',
            city: 'pending',
            source: 'browser_with_ip'
        };
    } catch (error) {
        console.warn('Erreur géolocalisation IP, utilisation des données basiques:', error);
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            ip: 'unknown',
            country: 'unknown',
            source: 'fallback'
        };
    }
};

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/login_verify`, {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    email: response.data.email,
                    roles: response.data.roles,
                    logCount: response.data.logCount
                }));

                return response.data;
            } else {
                return rejectWithValue(response.data.error);
            }
        } catch (error) {
            clearAuthStorage();
            return rejectWithValue(error.response?.data?.error || 'Erreur de connexion');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const userEmail = state.auth.user?.email;

            // Logger la déconnexion
            if (userEmail) {
                await logLogout(userEmail);
            }

            // Nettoyer le storage
            clearAuthStorage();

            return { success: true };
        } catch (error) {
            // En cas d'erreur, nettoyer quand même le storage
            clearAuthStorage();
            return rejectWithValue(error.message);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/refresh-token`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    email: response.data.email,
                    roles: response.data.roles,
                    logCount: response.data.logCount
                }));

                return response.data;
            } else {
                clearAuthStorage();
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            clearAuthStorage();
            return rejectWithValue(error.response?.data?.message || 'Erreur de rafraîchissement');
        }
    }
);

export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                clearAuthStorage();
                return rejectWithValue('Aucun token trouvé');
            }

            const response = await axios.post(`${BASE_URL}/is-token-valid`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });

            if (response.data.success) {
                localStorage.setItem('userData', JSON.stringify({
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    email: response.data.email,
                    roles: response.data.roles,
                    logCount: response.data.logCount
                }));

                return response.data;
            } else {
                clearAuthStorage();
                return rejectWithValue('Token invalide');
            }
        } catch (error) {
            clearAuthStorage();
            return rejectWithValue(error.response?.data?.message || 'Erreur de vérification');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('userData') || 'null'),
        token: localStorage.getItem('authToken'),
        isAuthenticated: !!localStorage.getItem('authToken'),
        loading: false,
        error: null,
        userInfo: null // Ajout de userInfo dans l'état initial
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSession: (state) => {
            clearAuthStorage();
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.userInfo = null;
        },
        forceLogout: (state) => {
            clearAuthStorage();
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = 'Session expirée';
            state.userInfo = null;
        },
        // AJOUT de setUserInfo qui manquait
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.error = null;

                state.user = {
                    firstname: action.payload.firstname,
                    lastname: action.payload.lastname,
                    email: action.payload.email,
                    roles: action.payload.roles,
                    logCount: action.payload.logCount
                };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = null;
                state.userInfo = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = action.payload;
                state.userInfo = null;
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = {
                    firstname: action.payload.firstname,
                    lastname: action.payload.lastname,
                    email: action.payload.email,
                    roles: action.payload.roles,
                    logCount: action.payload.logCount
                };
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = action.payload;
                state.userInfo = null;
            })
            // Verify Token
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
            })

            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.error = null;
                state.user = {
                    firstname: action.payload.firstname,
                    lastname: action.payload.lastname,
                    email: action.payload.email,
                    roles: action.payload.roles,
                    logCount: action.payload.logCount
                };
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = action.payload;
                state.userInfo = null;
            });
    },
});

// Export CORRECT de toutes les actions
export const {
    clearError,
    clearSession,
    forceLogout,
    setUserInfo // Maintenant exporté correctement
} = authSlice.actions;

export default authSlice.reducer;