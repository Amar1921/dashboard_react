import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from "@/ui/sidebar.jsx";
import Navbar from "@/ui/navbar.jsx";
import Footer from "@/ui/footer.jsx";
import { closeSidebarOnMobile } from "@/store/slices/uiSlice.js";

export default function DashboardLayout({ children }) {
    const dispatch = useDispatch();
    const { sidebarOpen, sidebarMinimized } = useSelector((state) => state.ui);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Overlay pour mobile */}
            {sidebarOpen && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0  bg-opacity-30 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => dispatch(closeSidebarOnMobile())}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative z-50 h-full
                transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'left-0' : '-left-full md:left-0'}
                ${sidebarMinimized ? 'w-20' : 'w-64'}
            `}>
                <Sidebar />
            </div>

            {/* Main content */}
            <div className={`
                flex-1 flex flex-col min-w-0
                transition-all duration-300 ease-in-out
                ${sidebarOpen && !sidebarMinimized ? 'md:ml-0' : ''}
            `}>
                {/* Navbar */}
                <Navbar />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}