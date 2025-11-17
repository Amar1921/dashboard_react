import {
    BarChart2,
    Book,
    Calculator,
    History,
    Home,
    Info as InfoIcon,
    Link as LinkIcon,
    LogsIcon,
    NotebookPen,
    Settings,
    Store as StoreIcon,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Users,
    Map,
    LandPlot,
    Calendar,
    TrendingUp
} from "lucide-react";

import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TokenCountdown from "./tokenCounter.jsx";

import {
    toggleSidebar,
    toggleSidebarMinimized,
    closeSidebarOnMobile,
    setSidebarOpen,
    setSidebarMinimized
} from "@/store/slices/uiSlice.js";

export const Sidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { sidebarOpen, sidebarMinimized } = useSelector((state) => state.ui);
    const { tokenInfos } = useSelector((state) => state.auth);

    const isAdmin = tokenInfos?.roles?.includes("ROLE_ADMIN");
    const isMobile = window.innerWidth < 768;

    // Ajustement selon largeur écran
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                // Mobile : fermé
                dispatch(setSidebarOpen(false));
                dispatch(setSidebarMinimized(false));
            } else if (width < 1024) {
                // Tablette : ouvert mais réduit
                dispatch(setSidebarOpen(true));
                dispatch(setSidebarMinimized(true));
            } else {
                // Desktop
                dispatch(setSidebarOpen(true));
                dispatch(setSidebarMinimized(false));
            }
        };

        handleResize();
        let timer;
        const listener = () => {
            clearTimeout(timer);
            timer = setTimeout(handleResize, 120);
        };

        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener);
            clearTimeout(timer);
        };
    }, [dispatch]);

    // Fermer auto sur mobile lors d'un changement de page
    useEffect(() => {
        if (window.innerWidth < 768) {
            dispatch(closeSidebarOnMobile());
        }
    }, [location, dispatch]);

    const handleToggleSidebar = () => dispatch(toggleSidebar());
    const handleToggleMinimized = () => dispatch(toggleSidebarMinimized());

    const handleNavigation = (path, label) => {
        navigate(path);
        // Note: Vous devrez peut-être ajouter une action pour setCurrentPage dans votre slice UI
        // dispatch(setCurrentPage(label.toLowerCase()));

        // Fermer la sidebar sur mobile après navigation
        if (isMobile) {
            dispatch(closeSidebarOnMobile());
        }
    };

    // Template pour les liens du menu - STYLE AMÉLIORÉ
    const renderNavLink = (to, icon, text, end = false) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => {
                const base = `
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer
                    transition-all duration-200 group relative
                    ${sidebarMinimized ? "justify-center px-2" : ""}
                `;

                if (isActive) {
                    return `
                        ${base} 
                        bg-gradient-to-r from-blue-500 to-blue-600 
                        text-white shadow-lg shadow-blue-200
                        border-l-4 border-white
                        font-semibold
                    `;
                }

                return `
                    ${base} 
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 
                    hover:text-blue-700 hover:shadow-md
                    text-gray-600
                    border-l-4 border-transparent
                    hover:border-blue-200
                `;
            }}
            title={sidebarMinimized ? text : undefined}
        >
            {({ isActive }) => (
                <>
                    <div className="flex items-center gap-3">
                        <div className={`
                            transition-transform duration-200 
                            ${isActive ? "scale-110 transform" : "group-hover:scale-105"}
                            ${isActive ? "text-white" : "text-current"}
                        `}>
                            {React.cloneElement(icon, {
                                size: 20,
                                className: isActive ? "text-white" : "text-current"
                            })}
                        </div>

                        <span
                            className={`
                                whitespace-nowrap transition-all duration-300
                                ${sidebarMinimized ? "w-0 opacity-0" : "w-auto opacity-100"}
                                ${isActive ? "font-bold" : "font-medium"}
                            `}
                        >
                            {text}
                        </span>
                    </div>

                    {/* Indicateur visuel pour l'élément actif en mode réduit */}
                    {sidebarMinimized && isActive && (
                        <div className="
                            absolute -left-1 top-1/2 transform -translate-y-1/2
                            w-1 h-6 bg-white rounded-r
                            shadow-sm
                        " />
                    )}

                    {/* Tooltip en mode réduit */}
                    {sidebarMinimized && (
                        <div className="
                            absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white
                            text-sm rounded opacity-0 group-hover:opacity-100
                            transition-opacity duration-200 whitespace-nowrap z-50
                            shadow-lg
                        ">
                            {text}
                            {isActive && (
                                <span className="ml-1 w-2 h-2 bg-white rounded-full inline-block"></span>
                            )}
                        </div>
                    )}
                </>
            )}
        </NavLink>
    );

    // Liste des items - CORRIGÉE
    const menuItems = [
        { to: '/', icon: <LayoutDashboard />, text: 'Tableau de bord', end: true },
        // { to: '/clients', icon: <Users />, text: 'Clients' },
        // { to: '/lotissements', icon: <Map />, text: 'Lotissements' },
        // { to: '/parcelles', icon: <LandPlot />, text: 'Parcelles' },
        // { to: '/echeances', icon: <Calendar />, text: 'Échéances' },
        //
        // { to: '/depenses', icon: <TrendingUp />, text: 'Dépenses' },
        { to: '/profile', icon: <Users />, text: 'Profile' },
        { to: '/parametres', icon: <Settings />, text: 'Paramètres' },
    ];

    return (
        <aside
            className={`
                bg-white shadow-lg h-full border-r border-gray-200 flex flex-col
                transition-all duration-300 ease-in-out
                ${sidebarMinimized ? "w-20" : "w-64"}
                ${!sidebarOpen ? "hidden" : "flex"}
            `}
        >
            {/* HEADER */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                    {!sidebarMinimized ? (
                        <div
                            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleNavigation('/dashboard', 'Tableau de bord')}
                        >
                            <LandPlot className="h-8 w-8 text-green-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">BGBS</span>
                        </div>
                    ) : (
                        <div
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleNavigation('/dashboard', 'Tableau de bord')}
                        >
                            <LandPlot className="h-8 w-8 text-green-600" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleToggleMinimized}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title={sidebarMinimized ? "Expand" : "Minimize"}
                    >
                        {sidebarMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    <button
                        onClick={handleToggleSidebar}
                        className="p-1 rounded hover:bg-gray-200 transition-colors md:hidden"
                        title="Close"
                    >
                        <ChevronLeft size={16} />
                    </button>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {renderNavLink(item.to, item.icon, item.text, item.end)}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* FOOTER */}
            <div className="p-3 border-t border-gray-200">
                <TokenCountdown isMinimized={sidebarMinimized} />
            </div>
        </aside>
    );
};