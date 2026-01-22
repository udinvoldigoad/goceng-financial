import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function PublicOnlyRoute({ children }) {
    const { auth } = useStore();

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

    // Redirect to dashboard if already authenticated
    if (auth.status === 'authed') {
        return <Navigate to="/" replace />;
    }

    // Render children (login page) if guest
    return children;
}
