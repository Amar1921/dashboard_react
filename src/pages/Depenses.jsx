import React from 'react';
import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";

const Depenses = () => {
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dépenses</h1>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-600">Gestion des dépenses - En construction</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Depenses;