export default function Logo({ className = "w-10 h-10", showText = false }) {
    return (
        <div className="flex items-center gap-3">
            {/* Circular Badge Logo */}
            <div className={`flex items-center justify-center bg-primary rounded-full ${className}`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-[60%] h-[60%]"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        fill="#fff"
                    />
                </svg>
            </div>
            {showText && (
                <span className="text-lg font-bold text-white tracking-tight">GOCENG</span>
            )}
        </div>
    );
}
