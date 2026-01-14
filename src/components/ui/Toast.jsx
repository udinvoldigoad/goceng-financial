import { Toaster } from 'react-hot-toast';

/**
 * Toast container component - add this to App.jsx or layout
 */
export default function ToastContainer() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#18282f',
                    color: '#f0f4f6',
                    border: '1px solid #1e343d',
                    borderRadius: '12px',
                    padding: '12px 16px',
                },
                success: {
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#18282f',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#18282f',
                    },
                },
            }}
        />
    );
}

// Re-export toast for easy access
export { toast } from 'react-hot-toast';
