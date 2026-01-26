import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable Modal component - Uses Portal to render at root level
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.size] - Modal size: 'sm', 'md', 'lg', 'xl'
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <div
                className={`bg-surface-dark border border-border-dark rounded-2xl p-6 w-full ${sizeClasses[size]} max-h-[85vh] overflow-y-auto shadow-2xl animate-modal-in`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-white transition-colors p-1 hover:bg-surface-highlight rounded-lg"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );

    // Use Portal to render modal at document body level
    return createPortal(modalContent, document.body);
}
