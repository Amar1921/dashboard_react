// components/auth/TokenCountdown.jsx
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Clock, RefreshCw, X, Zap} from "lucide-react";
import {clearSession, logoutUser, refreshToken} from "../store/slices/authSlice";
// components/auth/TokenCountdown.jsx

const TokenCountdown = ({ isMinimized = false, showFull = false }) => {
    const [remainingTime, setRemainingTime] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTriggered, setModalTriggered] = useState(false);
    const { token, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Fonction pour décoder un JWT
    const decodeJWT = (token) => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setRemainingTime(0);
            return;
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.exp) {
            setRemainingTime(0);
            dispatch(clearSession());
            return;
        }

        const expirationTime = payload.exp * 1000;

        const updateCountdown = () => {
            const now = Date.now();
            const diff = expirationTime - now;
            setRemainingTime(diff > 0 ? diff : 0);

            // Vérifier si le token expire dans moins de 15 minutes
            if (diff > 0 && diff <= 15 * 60 * 1000 && !modalTriggered) {
                setShowModal(true);
                setModalTriggered(true);
            }

            // Si le token a expiré
            if (diff <= 0) {
                dispatch(clearSession());
                window.location.reload();
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [token, modalTriggered, dispatch, isAuthenticated]);

    // Intervalle pour réafficher le modal toutes les 3 minutes
    useEffect(() => {
        let interval;
        if (showModal) {
            interval = setInterval(() => {
                setShowModal(true);
            }, 3 * 60 * 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showModal]);

    const handleExtendSession = async () => {
        try {
            await dispatch(refreshToken()).unwrap();
            setShowModal(false);
            setModalTriggered(false);
        } catch (error) {
            console.error('Erreur lors de l\'extension de session:', error);
            setShowModal(false);
            dispatch(clearSession());
        }
    };

    const handleLater = () => {
        setShowModal(false);
    };

    const handleLogoutNow = () => {
        setShowModal(false);
        dispatch(logoutUser());
    };

    const formatTime = (ms) => {
        if (!ms || ms <= 0) return '00:00:00';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatTimeShort = (ms) => {
        if (!ms || ms <= 0) return '0m';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h`;
        }
        return `${minutes}m`;
    };

    const getTimeColor = (ms) => {
        if (!ms || ms <= 0) return 'text-red-600';
        const totalMinutes = Math.floor(ms / 60000);
        if (totalMinutes < 5) return 'text-red-600';
        if (totalMinutes < 15) return 'text-orange-500';
        if (totalMinutes < 30) return 'text-yellow-500';
        return 'text-green-600';
    };

    const getTimeIcon = (ms) => {
        if (!ms || ms <= 0) return <Zap size={16} className="text-red-600" />;
        const totalMinutes = Math.floor(ms / 60000);
        if (totalMinutes < 5) return <Zap size={16} className="text-red-600 animate-pulse" />;
        if (totalMinutes < 15) return <Zap size={16} className="text-orange-500" />;
        if (totalMinutes < 30) return <Zap size={16} className="text-yellow-500" />;
        return <Clock size={16} className="text-green-600" />;
    };

    // Si non authentifié, ne rien afficher
    if (!isAuthenticated) {
        return null;
    }

    // Version réduite pour sidebar minimisée
    if (isMinimized) {
        return (
            <>
                <div className="flex flex-col items-center justify-start p-1 rounded-lg">
                    {remainingTime === 0 ? (
                        <div className="flex flex-col items-center space-y-1" title="Session expirée">
                            <Zap size={16} className="text-red-600" />
                            <span className="text-xs font-bold text-red-600">0</span>
                        </div>
                    ) : remainingTime === null ? (
                        <div className="flex flex-col items-center space-y-1" title="Chargement...">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-xs text-gray-500">--</span>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center space-y-1 transition-all duration-300"
                            title={`Temps restant: ${formatTime(remainingTime)}`}
                        >
                            {getTimeIcon(remainingTime)}
                            <span className={`text-xs font-bold ${getTimeColor(remainingTime)}`}>
                                {formatTimeShort(remainingTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Modal d'extension de session */}
                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-2xl bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Session sur le point d'expirer
                                </h3>
                                <button
                                    onClick={handleLater}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-3">
                                    Votre session va expirer dans :
                                </p>
                                <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Clock size={20} className="text-orange-500" />
                                    <span className="text-lg font-mono font-bold text-orange-600">
                                        {formatTime(remainingTime)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleLogoutNow}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Se déconnecter
                                </button>
                                <button
                                    onClick={handleExtendSession}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Étendre
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Version compacte pour sidebar normale
    if (!showFull) {
        return (
            <>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Session</span>
                    </div>

                    {remainingTime === 0 ? (
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                            <Zap size={14} />
                            <span className="text-sm">Expirée</span>
                        </div>
                    ) : remainingTime === null ? (
                        <div className="text-gray-500 text-sm">--</div>
                    ) : (
                        <div className="flex items-center gap-1">
                            {getTimeIcon(remainingTime)}
                            <span className={`text-sm font-mono font-bold ${getTimeColor(remainingTime)}`}>
                                {formatTimeShort(remainingTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-2xl bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Session sur le point d'expirer
                                </h3>
                                <button
                                    onClick={handleLater}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-3">
                                    Votre session va expirer dans :
                                </p>
                                <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Clock size={20} className="text-orange-500" />
                                    <span className="text-lg font-mono font-bold text-orange-600">
                                        {formatTime(remainingTime)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleLogoutNow}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Se déconnecter
                                </button>
                                <button
                                    onClick={handleExtendSession}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Étendre
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Version complète
    return (
        <>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-blue-600" />
                    <small className="text-sm font-semibold text-gray-700">Temps restant</small>
                </div>

                {remainingTime === 0 ? (
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                        <Zap size={16} />
                        <span>Session expirée</span>
                    </div>
                ) : remainingTime === null ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} />
                        <span>Chargement...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <span className={`text-lg font-mono font-bold ${getTimeColor(remainingTime)}`}>
                            {formatTime(remainingTime)}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                            {getTimeIcon(remainingTime)}
                            <span className="text-xs text-gray-500">
                                {formatTimeShort(remainingTime)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-2xl bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Session sur le point d'expirer
                            </h3>
                            <button
                                onClick={handleLater}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Votre session va expirer dans :
                            </p>
                            <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <Clock size={20} className="text-orange-500" />
                                <span className="text-lg font-mono font-bold text-orange-600">
                                    {formatTime(remainingTime)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleLogoutNow}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Se déconnecter
                            </button>
                            <button
                                onClick={handleExtendSession}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Étendre
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TokenCountdown;