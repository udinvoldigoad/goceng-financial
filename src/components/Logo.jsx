import logoImage from '../assets/logo.png';

export default function Logo({ className = "w-10 h-10", showText = false }) {
    return (
        <div className="flex items-center gap-3">
            {/* Logo Image - Square with rounded corners */}
            <img
                src={logoImage}
                alt="Goceng Logo"
                className={`${className} rounded-xl`}
            />
            {showText && (
                <span className="text-lg font-bold text-white tracking-tight">GOCENG</span>
            )}
        </div>
    );
}
