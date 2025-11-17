// components/NotFoundPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 text-orange-200 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* En-tête */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                    <AlertCircle className="h-10 w-10 text-red-500" />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">404</span>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Page non trouvée</h1>
                        <p className="text-red-100">
                            Oups ! La page que vous recherchez semble introuvable.
                        </p>
                    </div>

                    {/* Contenu */}
                    <div className="p-8">
                        {/* Détails de l'erreur */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <Search className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">
                                        URL demandée :
                                    </p>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all mt-1">
                                        {location.pathname}
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Que souhaitez-vous faire ?
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <Home className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Retourner à l'accueil
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Revenir à la page principale de l'application
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <ArrowLeft className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Retour en arrière
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Revenir à la page précédente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Page d'accueil
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </button>
                        </div>

                        {/* Support */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-600">
                                Si vous pensez qu'il s'agit d'une erreur,{' '}
                                <a
                                    href="/support"
                                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                                >
                                    contactez le support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Éléments décoratifs */}
                <div className="text-center mt-8">
                    <div className="inline-flex space-x-6 opacity-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;