export default function Profile() {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Profil</h1>
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden">
                        <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCgbulcB0M9cILVXQceQfzLp-PXgZzRQV2DrR2LdPSB7x6LL17D3FWLRg7-jDGJv5tWL9iUWDJKmK5rPfvEUSaqYaVz6Vp7tjHtkwzUZ6tGyWTjc0ro-Yu-UfYaLR_dGcLmasvBnkK_qS7vA9fmTKh-zOt6Neq3np-cjrDKGdfUY2H3A7zoDMeC_I8DPGDEqx96JtiK0VSKMsGKna-Ykm01CBwXX5j2kyqOjWYXrmslT9bYFFqtmSrNrGct7ieEpe_wXR-kx5TAPZT"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Udin Petot</h2>
                        <p className="text-text-muted">udin@goceng.id</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-white font-medium">January 2023</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Transaksi</p>
                        <p className="text-white font-medium">245 Transaksi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
