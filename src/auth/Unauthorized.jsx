import React from 'react';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <Shield className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Accès Refusé
                </h1>

                <p className="text-gray-600 mb-2">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Home size={18} />
                        Retour à l'accueil
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Retour en arrière
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;