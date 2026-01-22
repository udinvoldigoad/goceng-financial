import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const STORAGE_VERSION = 1;

/**
 * Generate unique ID
 * @returns {string}
 */
const generateId = () => crypto.randomUUID();

/**
 * Get current ISO timestamp
 * @returns {string}
 */
const now = () => new Date().toISOString();

/**
 * Get current month in YYYY-MM format
 * @returns {string}
 */
const getCurrentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const initialState = {
    wallets: [],
    assets: [],
    transactions: [],
    budgets: [],
    goals: [],
    subscriptions: [],
    notifications: [],
    user: {
        name: 'User',
        email: '',
        avatar: '',
    },
    auth: {
        status: 'loading', // 'loading' | 'authed' | 'guest'
        user: null,
        session: null,
    },
    settings: {
        theme: 'dark',
        currency: 'IDR',
        locale: 'id-ID',
        memberSince: now(),
    },
    _version: STORAGE_VERSION,
};

export const useStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // ==================== AUTH ACTIONS ====================
            initAuth: async () => {
                // If Supabase is not configured, set as guest immediately
                if (!isSupabaseConfigured || !supabase) {
                    console.warn('Supabase not configured - running in guest mode');
                    set({ auth: { status: 'guest', user: null, session: null } });
                    return;
                }

                try {
                    // Get current session
                    const { data: { session }, error } = await supabase.auth.getSession();

                    if (error) throw error;

                    if (session) {
                        const user = session.user;
                        set({
                            auth: { status: 'authed', user, session },
                            user: {
                                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                                email: user.email || '',
                                avatar: user.user_metadata?.avatar_url || '',
                            },
                        });
                    } else {
                        set({ auth: { status: 'guest', user: null, session: null } });
                    }

                    // Listen for auth changes
                    supabase.auth.onAuthStateChange((event, session) => {
                        if (session) {
                            const user = session.user;
                            set({
                                auth: { status: 'authed', user, session },
                                user: {
                                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                                    email: user.email || '',
                                    avatar: user.user_metadata?.avatar_url || '',
                                },
                            });
                        } else {
                            set({
                                auth: { status: 'guest', user: null, session: null },
                                user: { name: 'User', email: '', avatar: '' },
                            });
                        }
                    });
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    set({ auth: { status: 'guest', user: null, session: null } });
                }
            },

            signOut: async () => {
                try {
                    if (supabase) {
                        await supabase.auth.signOut();
                    }
                    set({
                        auth: { status: 'guest', user: null, session: null },
                        user: { name: 'User', email: '', avatar: '' },
                    });
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            },

            // ==================== NOTIFICATION ACTIONS ====================
            addNotification: (notification) => {
                const newNotification = {
                    id: generateId(),
                    createdAt: now(),
                    read: false,
                    ...notification,
                };
                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 50)
                }));
                return newNotification;
            },

            markNotificationRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                }));
            },

            markAllNotificationsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                }));
            },

            clearNotifications: () => {
                set({ notifications: [] });
            },

            // ==================== WALLET ACTIONS ====================
            addWallet: (wallet) => {
                const newWallet = {
                    id: generateId(),
                    createdAt: now(),
                    ...wallet,
                };
                set((state) => ({ wallets: [...state.wallets, newWallet] }));
                return newWallet;
            },

            updateWallet: (id, updates) => {
                set((state) => ({
                    wallets: state.wallets.map((w) =>
                        w.id === id ? { ...w, ...updates } : w
                    ),
                }));
            },

            deleteWallet: (id) => {
                set((state) => ({
                    wallets: state.wallets.filter((w) => w.id !== id),
                }));
            },

            getWalletById: (id) => {
                return get().wallets.find((w) => w.id === id);
            },

            getTotalWalletBalance: () => {
                return get().wallets.reduce((sum, w) => sum + w.balance, 0);
            },

            // ==================== ASSET ACTIONS ====================
            addAsset: (asset) => {
                const newAsset = {
                    id: generateId(),
                    createdAt: now(),
                    ...asset,
                };
                set((state) => ({ assets: [...state.assets, newAsset] }));
                return newAsset;
            },

            updateAsset: (id, updates) => {
                set((state) => ({
                    assets: state.assets.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                }));
            },

            deleteAsset: (id) => {
                set((state) => ({
                    assets: state.assets.filter((a) => a.id !== id),
                }));
            },

            getTotalAssetValue: () => {
                return get().assets.reduce((sum, a) => sum + a.value, 0);
            },

            // ==================== TRANSACTION ACTIONS ====================
            addTransaction: (transaction) => {
                const state = get();
                const newTransaction = {
                    id: generateId(),
                    createdAt: now(),
                    ...transaction,
                };

                // Update wallet balance based on transaction type
                let updatedWallets = [...state.wallets];

                if (transaction.type === 'income') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === transaction.walletId
                            ? { ...w, balance: w.balance + transaction.amount }
                            : w
                    );
                } else if (transaction.type === 'expense') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === transaction.walletId
                            ? { ...w, balance: w.balance - transaction.amount }
                            : w
                    );
                } else if (transaction.type === 'transfer') {
                    updatedWallets = updatedWallets.map((w) => {
                        if (w.id === transaction.walletId) {
                            return { ...w, balance: w.balance - transaction.amount };
                        }
                        if (w.id === transaction.walletTargetId) {
                            return { ...w, balance: w.balance + transaction.amount };
                        }
                        return w;
                    });
                }

                set({
                    transactions: [...state.transactions, newTransaction],
                    wallets: updatedWallets,
                });

                return newTransaction;
            },

            updateTransaction: (id, updates) => {
                // For simplicity, we don't recalculate balances on update
                // In a full implementation, you'd reverse the old transaction and apply the new one
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                }));
            },

            deleteTransaction: (id) => {
                const state = get();
                const transaction = state.transactions.find((t) => t.id === id);
                if (!transaction) return;

                // Reverse the balance changes
                let updatedWallets = [...state.wallets];

                if (transaction.type === 'income') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === transaction.walletId
                            ? { ...w, balance: w.balance - transaction.amount }
                            : w
                    );
                } else if (transaction.type === 'expense') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === transaction.walletId
                            ? { ...w, balance: w.balance + transaction.amount }
                            : w
                    );
                } else if (transaction.type === 'transfer') {
                    updatedWallets = updatedWallets.map((w) => {
                        if (w.id === transaction.walletId) {
                            return { ...w, balance: w.balance + transaction.amount };
                        }
                        if (w.id === transaction.walletTargetId) {
                            return { ...w, balance: w.balance - transaction.amount };
                        }
                        return w;
                    });
                }

                set({
                    transactions: state.transactions.filter((t) => t.id !== id),
                    wallets: updatedWallets,
                });
            },

            getTransactionsByDateRange: (startDate, endDate) => {
                return get().transactions.filter((t) => {
                    const date = new Date(t.date);
                    return date >= new Date(startDate) && date <= new Date(endDate);
                });
            },

            getTransactionsByMonth: (month) => {
                return get().transactions.filter((t) => t.date.startsWith(month));
            },

            getRecentTransactions: (limit = 5) => {
                return [...get().transactions]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, limit);
            },

            // ==================== BUDGET ACTIONS ====================
            addBudget: (budget) => {
                const newBudget = {
                    id: generateId(),
                    createdAt: now(),
                    month: budget.month || getCurrentMonth(),
                    ...budget,
                };
                set((state) => ({ budgets: [...state.budgets, newBudget] }));
                return newBudget;
            },

            updateBudget: (id, updates) => {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                }));
            },

            deleteBudget: (id) => {
                set((state) => ({
                    budgets: state.budgets.filter((b) => b.id !== id),
                }));
            },

            getBudgetSpent: (category, month) => {
                const transactions = get().transactions.filter(
                    (t) =>
                        t.type === 'expense' &&
                        t.category === category &&
                        t.date.startsWith(month)
                );
                return transactions.reduce((sum, t) => sum + t.amount, 0);
            },

            getBudgetsForMonth: (month) => {
                return get().budgets.filter((b) => b.month === month);
            },

            // ==================== GOAL ACTIONS ====================
            addGoal: (goal) => {
                const newGoal = {
                    id: generateId(),
                    createdAt: now(),
                    currentAmount: 0,
                    ...goal,
                };
                set((state) => ({ goals: [...state.goals, newGoal] }));
                return newGoal;
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                }));
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: state.goals.filter((g) => g.id !== id),
                }));
            },

            addGoalContribution: (id, amount) => {
                set((state) => ({
                    goals: state.goals.map((g) =>
                        g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
                    ),
                }));
            },

            // ==================== SUBSCRIPTION ACTIONS ====================
            addSubscription: (subscription) => {
                const newSubscription = {
                    id: generateId(),
                    createdAt: now(),
                    status: 'active',
                    ...subscription,
                };
                set((state) => ({
                    subscriptions: [...state.subscriptions, newSubscription],
                }));
                return newSubscription;
            },

            updateSubscription: (id, updates) => {
                set((state) => ({
                    subscriptions: state.subscriptions.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                }));
            },

            deleteSubscription: (id) => {
                set((state) => ({
                    subscriptions: state.subscriptions.filter((s) => s.id !== id),
                }));
            },

            markSubscriptionPaid: (id) => {
                const state = get();
                const subscription = state.subscriptions.find((s) => s.id === id);
                if (!subscription) return;

                // Calculate next due date based on cycle
                const currentDue = new Date(subscription.nextDueDate);
                let nextDue;

                switch (subscription.cycle) {
                    case 'weekly':
                        nextDue = new Date(currentDue.setDate(currentDue.getDate() + 7));
                        break;
                    case 'monthly':
                        nextDue = new Date(currentDue.setMonth(currentDue.getMonth() + 1));
                        break;
                    case 'yearly':
                        nextDue = new Date(currentDue.setFullYear(currentDue.getFullYear() + 1));
                        break;
                    default:
                        nextDue = currentDue;
                }

                set((state) => ({
                    subscriptions: state.subscriptions.map((s) =>
                        s.id === id
                            ? { ...s, nextDueDate: nextDue.toISOString().split('T')[0] }
                            : s
                    ),
                }));
            },

            getUpcomingSubscriptions: (days = 7) => {
                const now = new Date();
                const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                return get()
                    .subscriptions.filter((s) => {
                        if (s.status !== 'active') return false;
                        const dueDate = new Date(s.nextDueDate);
                        return dueDate >= now && dueDate <= futureDate;
                    })
                    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
            },

            // ==================== SETTINGS ACTIONS ====================
            updateSettings: (updates) => {
                set((state) => ({
                    settings: { ...state.settings, ...updates },
                }));
            },

            // ==================== USER ACTIONS ====================
            updateUser: (updates) => {
                set((state) => ({
                    user: { ...state.user, ...updates },
                }));
            },

            toggleTheme: () => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        theme: state.settings.theme === 'dark' ? 'light' : 'dark',
                    },
                }));
            },

            // ==================== DATA MANAGEMENT ====================
            resetAllData: () => {
                set({
                    ...initialState,
                    settings: {
                        ...initialState.settings,
                        memberSince: now(),
                    },
                });
            },

            exportData: () => {
                const state = get();
                return JSON.stringify({
                    wallets: state.wallets,
                    assets: state.assets,
                    transactions: state.transactions,
                    budgets: state.budgets,
                    goals: state.goals,
                    subscriptions: state.subscriptions,
                    settings: state.settings,
                    exportedAt: now(),
                    version: STORAGE_VERSION,
                });
            },

            importData: (jsonString) => {
                try {
                    const data = JSON.parse(jsonString);
                    set({
                        wallets: data.wallets || [],
                        assets: data.assets || [],
                        transactions: data.transactions || [],
                        budgets: data.budgets || [],
                        goals: data.goals || [],
                        subscriptions: data.subscriptions || [],
                        settings: data.settings || initialState.settings,
                    });
                    return true;
                } catch (error) {
                    console.error('Failed to import data:', error);
                    return false;
                }
            },

            // ==================== COMPUTED VALUES ====================
            getTotalAssets: () => {
                const state = get();
                const walletTotal = state.wallets.reduce((sum, w) => sum + w.balance, 0);
                const assetTotal = state.assets.reduce((sum, a) => sum + a.value, 0);
                return walletTotal + assetTotal;
            },

            getTodaysSummary: () => {
                const today = new Date().toISOString().split('T')[0];
                const transactions = get().transactions.filter((t) =>
                    t.date.startsWith(today)
                );

                const income = transactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = transactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                return { income, expense };
            },

            getMonthlySummary: (month) => {
                const monthToUse = month || getCurrentMonth();
                const transactions = get().transactions.filter((t) =>
                    t.date.startsWith(monthToUse)
                );

                const income = transactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = transactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                return { income, expense, net: income - expense };
            },

            getCategoryBreakdown: (month) => {
                const monthToUse = month || getCurrentMonth();
                const expenses = get().transactions.filter(
                    (t) => t.type === 'expense' && t.date.startsWith(monthToUse)
                );

                const breakdown = {};
                expenses.forEach((t) => {
                    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
                });

                return Object.entries(breakdown).map(([category, amount]) => ({
                    category,
                    amount,
                }));
            },
        }),
        {
            name: 'goceng-storage',
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => localStorage),
            migrate: (persistedState, version) => {
                // Handle migrations between storage versions if needed
                if (version === 0) {
                    // Migration from version 0 to 1
                    return { ...persistedState, _version: 1 };
                }
                return persistedState;
            },
        }
    )
);

export default useStore;
