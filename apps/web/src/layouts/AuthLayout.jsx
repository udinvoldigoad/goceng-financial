export default function AuthLayout({ children }) {
    return (
        <div className="bg-background-dark font-display min-h-screen flex items-center justify-center relative overflow-hidden text-slate-200">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-background-dark to-blue-950 z-0"></div>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[128px]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]"></div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-xs text-slate-600/80 z-10 w-full text-center">
                © 2025 Goceng Financial. Build by Udin Voldigoad.
            </div>
        </div>
    );
}
