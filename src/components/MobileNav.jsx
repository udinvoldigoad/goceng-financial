import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useStore from '../store/useStore';
import TransactionForm from './forms/TransactionForm';

/**
 * MobileNav - Bottom navigation bar for mobile view
 * Shows: Beranda, Dompet, Tambah (FAB), Riwayat, Lainnya
 */
export default function MobileNav() {
    const navigate = useNavigate();
    const { openLoginModal, auth } = useStore();
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const handleAddClick = () => {
        if (auth.status !== 'authed') {
            openLoginModal();
            return;
        }
        setShowAddTransaction(true);
    };

    const navItems = [
        { path: '/', icon: 'grid_view', label: 'Beranda' },
        { path: '/assets', icon: 'account_balance_wallet', label: 'Dompet' },
        { type: 'add' }, // Special center button
        { path: '/transactions', icon: 'receipt_long', label: 'Riwayat' },
        { type: 'more', icon: 'more_horiz', label: 'Lainnya' },
    ];

    const moreMenuItems = [
        { path: '/budget', icon: 'pie_chart', label: 'Anggaran' },
        { path: '/goals', icon: 'flag', label: 'Target' },
        { path: '/debts', icon: 'swap_horiz', label: 'Hutang & Piutang' },
        { path: '/subscriptions', icon: 'autorenew', label: 'Langganan' },
        { path: '/reports', icon: 'bar_chart', label: 'Laporan' },
        { path: '/settings', icon: 'settings', label: 'Pengaturan' },
    ];

    return (
        <>
            {/* Bottom Navigation */}
            <nav className="fixed bottom-2 left-4 right-4 bg-gradient-to-b from-surface-dark/60 to-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-2xl z-[60] md:hidden safe-area-bottom shadow-xl">
                <div className="flex items-center justify-around h-[72px] px-2">
                    {navItems.map((item, index) => {
                        if (item.type === 'add') {
                            // Center FAB button
                            return (
                                <button
                                    key="add"
                                    onClick={handleAddClick}
                                    className="relative -mt-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-white text-3xl">add</span>
                                </button>
                            );
                        }

                        if (item.type === 'more') {
                            return (
                                <button
                                    key="more"
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    className={`flex flex-col items-center justify-center py-2 px-3 transition-all ${showMoreMenu ? 'text-primary' : 'text-text-muted'}`}
                                >
                                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                    <span className="text-[10px] mt-0.5">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center py-2 px-3 transition-colors ${isActive ? 'text-primary' : 'text-text-muted'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                <span className="text-[10px] mt-0.5">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* More Menu Overlay - only covers above the nav */}
            {showMoreMenu && (
                <div
                    className="fixed inset-0 bottom-[88px] bg-black/40 z-50 md:hidden"
                    onClick={() => setShowMoreMenu(false)}
                >
                    <div
                        className="absolute bottom-2 left-4 right-4 bg-surface-dark/95 backdrop-blur-xl rounded-2xl p-4 animate-slide-up border border-border-dark shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-border-dark rounded-full mx-auto mb-4" />
                        <div className="space-y-1">
                            {moreMenuItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setShowMoreMenu(false);
                                    }}
                                    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-surface-highlight transition-colors"
                                >
                                    <span className="material-symbols-outlined text-text-muted text-xl">{item.icon}</span>
                                    <span className="text-sm text-white font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Form Modal */}
            <TransactionForm
                isOpen={showAddTransaction}
                onClose={() => setShowAddTransaction(false)}
            />
        </>
    );
}
