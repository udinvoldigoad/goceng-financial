import { useLocation } from 'react-router-dom';

/**
 * PageTransition component - Wraps page content with entrance animation
 * Uses key prop to force re-render on route change
 */
export default function PageTransition({ children }) {
    const location = useLocation();

    return (
        <div
            key={location.pathname}
            className="animate-page-in"
        >
            {children}
        </div>
    );
}

/**
 * StaggeredItem - Wraps individual items for staggered animation
 * @param {number} index - Index of the item (used for delay calculation)
 * @param {React.ReactNode} children - Content to animate
 * @param {string} className - Additional CSS classes
 */
export function StaggeredItem({ index = 0, children, className = '' }) {
    const delay = index * 0.08; // 80ms delay between each item

    return (
        <div
            className={`animate-stagger-in ${className}`}
            style={{ animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}

/**
 * StaggeredContainer - Container that applies stagger animation to direct children
 * Automatically assigns index to each child
 */
export function StaggeredContainer({ children, className = '', baseDelay = 0 }) {
    const location = useLocation();

    return (
        <div key={location.pathname} className={className}>
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <div
                        key={index}
                        className="animate-stagger-in"
                        style={{ animationDelay: `${baseDelay + index * 0.08}s` }}
                    >
                        {child}
                    </div>
                ))
                : <div className="animate-stagger-in" style={{ animationDelay: `${baseDelay}s` }}>{children}</div>
            }
        </div>
    );
}
