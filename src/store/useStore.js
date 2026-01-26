import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { loadUserData, saveUserData } from '../services/supabaseSync';

// Debounce utility for auto-save
let saveTimeout = null;
const debouncedSaveToCloud = (userId, getData) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        const state = getData();
        await saveUserData(userId, {
            wallets: state.wallets,
            assets: state.assets,
            transactions: state.transactions,
            budgets: state.budgets,
            goals: state.goals,
            subscriptions: state.subscriptions,
            settings: state.settings,
        });
    }, 2000); // 2 second debounce
};

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
    debts: [],
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
    isAppLoading: true, // Global loading state
    loadingMessage: 'Memuat aplikasi...', // Loading message
    showLoginModal: false,
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
                    // Check if this is an OAuth callback (has hash params or code param)
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const urlParams = new URLSearchParams(window.location.search);
                    const hasAuthCallback = hashParams.has('access_token') || urlParams.has('code');

                    console.log('OAuth callback detected:', hasAuthCallback);
                    console.log('URL hash:', window.location.hash);
                    console.log('URL search:', window.location.search);

                    // Setup auth state change listener
                    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                        console.log('Auth state changed:', event, session ? 'Has session' : 'No session');

                        if (event === 'SIGNED_IN' && session) {
                            const user = session.user;
                            set({
                                auth: { status: 'authed', user, session },
                                user: {
                                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                                    email: user.email || '',
                                    avatar: user.user_metadata?.avatar_url || '',
                                },
                                showLoginModal: false, // Auto-close login modal on successful auth
                                loadingMessage: 'Menyinkronkan data...',
                            });

                            // Load data from cloud
                            loadUserData(user.id).then(cloudData => {
                                if (cloudData) {
                                    console.log('📥 Loading data from cloud...');
                                    set({
                                        wallets: cloudData.wallets || [],
                                        assets: cloudData.assets || [],
                                        transactions: cloudData.transactions || [],
                                        budgets: cloudData.budgets || [],
                                        goals: cloudData.goals || [],
                                        subscriptions: cloudData.subscriptions || [],
                                        settings: { ...get().settings, ...cloudData.settings },
                                        isAppLoading: false,
                                    });
                                } else {
                                    // No cloud data - save current local data to cloud
                                    console.log('📤 No cloud data found, syncing local data to cloud...');
                                    debouncedSaveToCloud(user.id, get);
                                    set({ isAppLoading: false });
                                }
                            });

                            // Clean up URL after successful auth
                            if (window.location.hash || window.location.search.includes('code=')) {
                                window.history.replaceState({}, '', window.location.pathname);
                            }
                        } else if (event === 'SIGNED_OUT') {
                            set({
                                auth: { status: 'guest', user: null, session: null },
                                user: { name: 'User', email: '', avatar: '' },
                                isAppLoading: false,
                            });
                        } else if (event === 'TOKEN_REFRESHED' && session) {
                            const user = session.user;
                            set({
                                auth: { status: 'authed', user, session },
                                user: {
                                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                                    email: user.email || '',
                                    avatar: user.user_metadata?.avatar_url || '',
                                },
                            });
                        } else if (event === 'INITIAL_SESSION') {
                            // For INITIAL_SESSION, only set guest if no session AND no auth callback pending
                            if (session) {
                                const user = session.user;
                                set({
                                    auth: { status: 'authed', user, session },
                                    user: {
                                        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                                        email: user.email || '',
                                        avatar: user.user_metadata?.avatar_url || '',
                                    },
                                    loadingMessage: 'Menyinkronkan data...',
                                });

                                // Load data from cloud for returning users
                                loadUserData(user.id).then(cloudData => {
                                    if (cloudData) {
                                        console.log('📥 Loading data from cloud (returning user)...');
                                        set({
                                            wallets: cloudData.wallets || [],
                                            assets: cloudData.assets || [],
                                            transactions: cloudData.transactions || [],
                                            budgets: cloudData.budgets || [],
                                            goals: cloudData.goals || [],
                                            subscriptions: cloudData.subscriptions || [],
                                            settings: { ...get().settings, ...cloudData.settings },
                                            isAppLoading: false,
                                        });
                                    } else {
                                        set({ isAppLoading: false });
                                    }
                                });
                            } else if (!hasAuthCallback) {
                                set({ auth: { status: 'guest', user: null, session: null }, isAppLoading: false });
                            }
                            // If hasAuthCallback but no session, keep loading state - wait for SIGNED_IN event
                        }
                    });

                    // If there's an OAuth callback, we wait for onAuthStateChange to handle it
                    // Otherwise, get current session normally
                    if (!hasAuthCallback) {
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
                        }
                        // If no session and no callback, onAuthStateChange INITIAL_SESSION will set to guest
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    set({ auth: { status: 'guest', user: null, session: null }, isAppLoading: false });
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

            // ==================== LOGIN MODAL ACTIONS ====================
            openLoginModal: () => set({ showLoginModal: true }),
            closeLoginModal: () => set({ showLoginModal: false }),

            // ==================== LOADING STATE ACTIONS ====================
            setAppLoading: (isLoading, message = 'Memuat...') => set({ isAppLoading: isLoading, loadingMessage: message }),

            // ==================== CLOUD SYNC ACTIONS ====================
            syncToCloud: async () => {
                const state = get();
                if (state.auth.status !== 'authed' || !state.auth.user?.id) {
                    console.log('Not authenticated, skipping cloud sync');
                    return false;
                }

                return await saveUserData(state.auth.user.id, {
                    wallets: state.wallets,
                    assets: state.assets,
                    transactions: state.transactions,
                    budgets: state.budgets,
                    goals: state.goals,
                    subscriptions: state.subscriptions,
                    settings: state.settings,
                });
            },

            // Helper to trigger auto-sync (debounced)
            triggerAutoSync: () => {
                const state = get();
                if (state.auth.status === 'authed' && state.auth.user?.id) {
                    debouncedSaveToCloud(state.auth.user.id, get);
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
                get().triggerAutoSync();
                return newWallet;
            },

            updateWallet: (id, updates) => {
                set((state) => ({
                    wallets: state.wallets.map((w) =>
                        w.id === id ? { ...w, ...updates } : w
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteWallet: (id) => {
                set((state) => ({
                    wallets: state.wallets.filter((w) => w.id !== id),
                }));
                get().triggerAutoSync();
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
                get().triggerAutoSync();
                return newAsset;
            },

            updateAsset: (id, updates) => {
                set((state) => ({
                    assets: state.assets.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteAsset: (id) => {
                set((state) => ({
                    assets: state.assets.filter((a) => a.id !== id),
                }));
                get().triggerAutoSync();
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

                get().triggerAutoSync();
                return newTransaction;
            },

            updateTransaction: (id, updates) => {
                const state = get();
                const oldTransaction = state.transactions.find((t) => t.id === id);
                if (!oldTransaction) return;

                const newTransaction = { ...oldTransaction, ...updates };
                let updatedWallets = [...state.wallets];

                // Step 1: Reverse the old transaction's effect on wallets
                if (oldTransaction.type === 'income') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === oldTransaction.walletId
                            ? { ...w, balance: w.balance - oldTransaction.amount }
                            : w
                    );
                } else if (oldTransaction.type === 'expense') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === oldTransaction.walletId
                            ? { ...w, balance: w.balance + oldTransaction.amount }
                            : w
                    );
                } else if (oldTransaction.type === 'transfer') {
                    updatedWallets = updatedWallets.map((w) => {
                        if (w.id === oldTransaction.walletId) {
                            return { ...w, balance: w.balance + oldTransaction.amount };
                        }
                        if (w.id === oldTransaction.walletTargetId) {
                            return { ...w, balance: w.balance - oldTransaction.amount };
                        }
                        return w;
                    });
                }

                // Step 2: Apply the new transaction's effect on wallets
                if (newTransaction.type === 'income') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === newTransaction.walletId
                            ? { ...w, balance: w.balance + newTransaction.amount }
                            : w
                    );
                } else if (newTransaction.type === 'expense') {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === newTransaction.walletId
                            ? { ...w, balance: w.balance - newTransaction.amount }
                            : w
                    );
                } else if (newTransaction.type === 'transfer') {
                    updatedWallets = updatedWallets.map((w) => {
                        if (w.id === newTransaction.walletId) {
                            return { ...w, balance: w.balance - newTransaction.amount };
                        }
                        if (w.id === newTransaction.walletTargetId) {
                            return { ...w, balance: w.balance + newTransaction.amount };
                        }
                        return w;
                    });
                }

                set({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? newTransaction : t
                    ),
                    wallets: updatedWallets,
                });
                get().triggerAutoSync();
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
                get().triggerAutoSync();
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
                get().triggerAutoSync();
                return newBudget;
            },

            updateBudget: (id, updates) => {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteBudget: (id) => {
                set((state) => ({
                    budgets: state.budgets.filter((b) => b.id !== id),
                }));
                get().triggerAutoSync();
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
                get().triggerAutoSync();
                return newGoal;
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: state.goals.filter((g) => g.id !== id),
                }));
                get().triggerAutoSync();
            },

            addGoalContribution: (id, amount) => {
                set((state) => ({
                    goals: state.goals.map((g) =>
                        g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
                    ),
                }));
                get().triggerAutoSync();
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
                get().triggerAutoSync();
                return newSubscription;
            },

            updateSubscription: (id, updates) => {
                set((state) => ({
                    subscriptions: state.subscriptions.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteSubscription: (id) => {
                set((state) => ({
                    subscriptions: state.subscriptions.filter((s) => s.id !== id),
                }));
                get().triggerAutoSync();
            },

            markSubscriptionPaid: (id) => {
                const state = get();
                const subscription = state.subscriptions.find((s) => s.id === id);
                if (!subscription) return { success: false, error: 'Subscription not found' };

                // Check wallet balance before creating transaction
                const wallet = state.wallets.find((w) => w.id === subscription.walletId);
                if (wallet && wallet.balance < subscription.amount) {
                    return { success: false, error: 'insufficient_balance', walletName: wallet.name };
                }

                // Create expense transaction for this payment
                const newTransaction = {
                    id: generateId(),
                    createdAt: now(),
                    type: 'expense',
                    amount: subscription.amount,
                    category: 'bills',
                    description: `Pembayaran ${subscription.name}`,
                    walletId: subscription.walletId,
                    date: new Date().toISOString().split('T')[0],
                };

                // Update wallet balance
                let updatedWallets = [...state.wallets];
                if (subscription.walletId) {
                    updatedWallets = updatedWallets.map((w) =>
                        w.id === subscription.walletId
                            ? { ...w, balance: w.balance - subscription.amount }
                            : w
                    );
                }

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
                    transactions: [...state.transactions, newTransaction],
                    wallets: updatedWallets,
                    subscriptions: state.subscriptions.map((s) =>
                        s.id === id
                            ? { ...s, nextDueDate: nextDue.toISOString().split('T')[0] }
                            : s
                    ),
                }));

                get().triggerAutoSync();
                return { success: true, transaction: newTransaction };
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

            // ==================== DEBT ACTIONS ====================
            addDebt: (debt) => {
                const newDebt = {
                    id: generateId(),
                    createdAt: now(),
                    status: 'unpaid', // unpaid, paid
                    ...debt,
                };
                set((state) => ({
                    debts: [...state.debts, newDebt],
                }));
                get().triggerAutoSync();
                return newDebt;
            },

            updateDebt: (id, updates) => {
                set((state) => ({
                    debts: state.debts.map((d) =>
                        d.id === id ? { ...d, ...updates } : d
                    ),
                }));
                get().triggerAutoSync();
            },

            deleteDebt: (id) => {
                set((state) => ({
                    debts: state.debts.filter((d) => d.id !== id),
                }));
                get().triggerAutoSync();
            },

            markDebtPaid: (id) => {
                set((state) => ({
                    debts: state.debts.map((d) =>
                        d.id === id ? { ...d, status: 'paid', paidAt: now() } : d
                    ),
                }));
                get().triggerAutoSync();
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
                    // Sync imported data to cloud
                    get().triggerAutoSync();
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
