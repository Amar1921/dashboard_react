import React from 'react';
import ParcelleList from "../components/Parcelles/ParcelleList.jsx";
import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";

const Parcelles = () => {
    return (
        <DashboardLayout>
                  <ParcelleList/>
        </DashboardLayout>
    );
};

export default Parcelles;