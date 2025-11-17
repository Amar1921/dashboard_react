import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertCircle, Eye, EyeOff, LogIn} from 'lucide-react';
import {clearError, loginUser, setUserInfo} from '@/store/slices/authSlice';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Ajouter navigate
    const { loading, error, userInfo, isAuthenticated } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Rediriger si déjà authentifié
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // ou vers la page d'accueil souhaitée
        }
    }, [isAuthenticated, navigate]);

    // Collecter les informations utilisateur au chargement
    useEffect(() => {
        const collectUserInfo = async () => {
            const info = {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screen: {
                    width: screen.width,
                    height: screen.height
                },
                cookies: navigator.cookieEnabled,
                javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
                timestamp: new Date().toISOString()
            };

            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                info.ip = ipData.ip;

                const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                const locationData = await locationResponse.json();

                if (locationData) {
                    info.location = {
                        country: locationData.country_name,
                        city: locationData.city,
                        region: locationData.region,
                        timezone: locationData.timezone,
                        isp: locationData.org
                    };
                }
            } catch (error) {
                console.log('Impossible de récupérer les informations de localisation');
            }

            dispatch(setUserInfo(info));
        };

        collectUserInfo();
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            dispatch(clearError());
            return;
        }

        try {
            await dispatch(loginUser({
                email: formData.email,
                password: formData.password,
                userInfo: userInfo
            })).unwrap();

            // La redirection se fera via le useEffect qui surveille isAuthenticated
        } catch (error) {
            // L'erreur est déjà gérée dans le slice
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) {
            dispatch(clearError());
        }
    };

    // Si déjà authentifié, on affiche un loading pendant la redirection
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirection en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Connexion
                    </h1>
                    <p className="text-gray-600">
                        Accédez à votre espace de gestion
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-800 text-sm">{error}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 pr-10"
                                placeholder="Votre mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Connexion...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-4 w-4 mr-2" />
                                Se connecter
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Système de gestion des versements
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;