// components/auth/ProtectedRoute.jsx
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet, useNavigate} from 'react-router-dom';
import {verifyToken} from '@/store/slices/authSlice';

const ProtectedRoute = ( ) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated) {
                try {
                    await dispatch(verifyToken()).unwrap();
                } catch (error) {
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [isAuthenticated, dispatch, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet/> : navigate('/login');
};

export default ProtectedRoute;