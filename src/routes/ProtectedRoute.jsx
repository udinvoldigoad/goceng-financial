import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/useStore';

export default function ProtectedRoute() {
    const { auth, openLoginModal } = useStore();

    // Show loading state while checking auth
    if (auth.status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-muted text-sm">Memuat...</p>
                </div>
            </div>
        );
    }

    // Redirect to home and open login modal if not authenticated
    if (auth.status === 'guest') {
        // Open login modal when trying to access protected route
        openLoginModal();
        return <Navigate to="/" replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
}

