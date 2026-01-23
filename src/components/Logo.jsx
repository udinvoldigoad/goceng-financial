import logoSrc from '../assets/goceng.png';

export default function Logo({ className = "w-10 h-10" }) {
    return (
        <img
            src={logoSrc}
            alt="Goceng Logo"
            className={`object-contain rounded-full ${className}`}
        />
    );
}
