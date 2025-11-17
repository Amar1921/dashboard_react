import React from 'react';
import LotissementList from '../components/Lotissements/LotissementList';
import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";

const Lotissements = () => {
    return (
        <DashboardLayout>
            <LotissementList />
        </DashboardLayout>
    );
};

export default Lotissements;