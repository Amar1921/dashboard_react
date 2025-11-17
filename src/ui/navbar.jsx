import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setSidebarOpen, toggleSidebarMinimized } from '../store/slices/uiSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { sidebarOpen, sidebarMinimized } = useSelector((state) => state.ui);

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleSidebar = () => {
        const width = window.innerWidth;

        if (width < 768) {
            // MOBILE : ouvrir / fermer
            dispatch(setSidebarOpen(!sidebarOpen));
        } else {
            // TABLETTE & DESKTOP : réduire / élargir
            dispatch(toggleSidebarMinimized());
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleToggleSidebar}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <button
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 relative"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Profile menu"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                            {userInfo.firstname ? userInfo.firstname.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div className="hidden md:block text-left">
                            <div className="text-sm font-medium">
                                {userInfo.firstname} {userInfo.lastname}
                            </div>
                            <div className="text-xs text-gray-500">
                                {userInfo.role || 'User'}
                            </div>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-40 border border-gray-200 py-1">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-900">
                                    {userInfo.firstname} {userInfo.lastname}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {userInfo.email}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    navigate('/profile');
                                    setProfileOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <User size={16} />
                                Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100 mt-1"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
