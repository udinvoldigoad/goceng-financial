/**
 * Global Loading Spinner Component
 * Used for auth loading state and full-page loading scenarios
 */
export default function LoadingScreen({ message = 'Memuat...' }) {
    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                    <span className="text-white font-black text-2xl">G</span>
                </div>
            </div>

            {/* Spinner */}
            <div className="relative mb-6">
                <div className="w-12 h-12 border-4 border-surface-highlight rounded-full animate-spin border-t-primary"></div>
            </div>

            {/* Message */}
            <p className="text-text-muted text-sm animate-pulse">{message}</p>
        </div>
    );
}

/**
 * Inline Loading Spinner for smaller areas
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`${sizes[size]} border-surface-highlight rounded-full animate-spin border-t-primary ${className}`}></div>
    );
}

/**
 * Skeleton Loader for content placeholders
 */
export function Skeleton({ className = '', variant = 'rect' }) {
    const baseClass = 'animate-pulse bg-surface-highlight';

    const variants = {
        rect: 'rounded-lg',
        circle: 'rounded-full',
        text: 'rounded h-4',
    };

    return <div className={`${baseClass} ${variants[variant]} ${className}`}></div>;
}

/**
 * Card Skeleton for dashboard cards
 */
export function CardSkeleton() {
    return (
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-highlight"></div>
                <div className="flex-1">
                    <div className="h-4 bg-surface-highlight rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-surface-highlight rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-6 bg-surface-highlight rounded w-1/2"></div>
        </div>
    );
}

/**
 * Transaction Skeleton for transaction list items
 */
export function TransactionSkeleton() {
    return (
        <div className="flex items-center justify-between gap-3 p-3 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-highlight"></div>
                <div>
                    <div className="h-4 bg-surface-highlight rounded w-24 mb-2"></div>
                    <div className="h-3 bg-surface-highlight rounded w-16"></div>
                </div>
            </div>
            <div className="h-4 bg-surface-highlight rounded w-20"></div>
        </div>
    );
}
