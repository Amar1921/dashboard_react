import React from 'react';
import EcheanceList from "../components/Echeances/EcheanceList.jsx";
import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";

const Echeances = () => {
    return (
        <DashboardLayout>
                <EcheanceList />
        </DashboardLayout>
    );
};

export default Echeances;