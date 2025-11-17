import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './services/axiosConfig';
import LoginPage from "./auth/login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unauthorized from "./auth/Unauthorized.jsx";
import {Error404} from "./ui/Error404.jsx";
import DashboardLayout from "@/layout/DashboardLayout.jsx";
import ProfilePage from "@/auth/ProfilePage.jsx";
import NotFoundPage from "@/ui/NotFoundPage.jsx";


// Mise à jour du composant App avec toutes les routes
function App() {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Route racine redirige vers le dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Routes protégées */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<h1>Dashbord</h1>} />
                    <Route path="profile" element={<ProfilePage />} />
                    {/*<Route path="users" element={<UsersManagement />} />*/}
                    {/*<Route path="analytics" element={<Analytics />} />*/}
                    {/*<Route path="settings" element={<Settings />} />*/}

                    {/* Route admin avec protection spécifique */}
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute roles={['ROLE_ADMIN', 'admin']}>
                              <h1>Admin Panel</h1>
                            </ProtectedRoute>
                        }
                    />

                    {/* Route 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;