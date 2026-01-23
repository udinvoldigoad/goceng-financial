import useStore from '../store/useStore';

/**
 * Hook to require authentication before performing an action.
 * If user is not authenticated, opens the login modal.
 * 
 * @returns {Object} { requireAuth, isAuthenticated }
 */
export function useRequireAuth() {
    const { auth, openLoginModal } = useStore();

    /**
     * Wraps an action to require authentication.
     * If authenticated, executes the callback immediately.
     * If not authenticated, opens the login modal.
     * 
     * @param {Function} callback - The action to execute if authenticated
     * @returns {boolean} - True if authenticated and callback was executed
     */
    const requireAuth = (callback) => {
        if (auth.status !== 'authed') {
            openLoginModal();
            return false;
        }
        if (callback) {
            callback();
        }
        return true;
    };

    return {
        requireAuth,
        isAuthenticated: auth.status === 'authed',
        isLoading: auth.status === 'loading'
    };
}

export default useRequireAuth;
