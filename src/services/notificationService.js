/**
 * Notification Service
 * Generates automatic notifications for various events
 */

import { getCurrentMonth } from './formatters';
import { getBudgetSpent } from './calculations';

/**
 * Check for upcoming subscription payments and generate notifications
 * @param {Array} subscriptions - List of subscriptions
 * @param {Array} existingNotifications - Current notifications to avoid duplicates
 * @returns {Array} New notifications to add
 */
export function checkSubscriptionReminders(subscriptions, existingNotifications = []) {
    const notifications = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

    activeSubscriptions.forEach(sub => {
        const dueDate = new Date(sub.nextDueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        // Generate notification ID based on subscription and due date
        const notificationId = `sub-${sub.id}-${sub.nextDueDate}`;

        // Skip if notification already exists
        if (existingNotifications.some(n => n.id === notificationId)) {
            return;
        }

        // Overdue payment
        if (diffDays < 0) {
            notifications.push({
                id: notificationId,
                type: 'alert',
                icon: 'warning',
                title: `${sub.name} Terlambat Dibayar`,
                message: `Pembayaran jatuh tempo ${Math.abs(diffDays)} hari yang lalu`,
                link: '/subscriptions',
            });
        }
        // Due today
        else if (diffDays === 0) {
            notifications.push({
                id: notificationId,
                type: 'alert',
                icon: 'schedule',
                title: `${sub.name} Jatuh Tempo Hari Ini`,
                message: `Jangan lupa bayar Rp ${new Intl.NumberFormat('id-ID').format(sub.amount)}`,
                link: '/subscriptions',
            });
        }
        // Due tomorrow
        else if (diffDays === 1) {
            notifications.push({
                id: notificationId,
                type: 'reminder',
                icon: 'event_upcoming',
                title: `${sub.name} Jatuh Tempo Besok`,
                message: `Pembayaran Rp ${new Intl.NumberFormat('id-ID').format(sub.amount)}`,
                link: '/subscriptions',
            });
        }
        // Due in 3 days
        else if (diffDays === 3) {
            notifications.push({
                id: notificationId,
                type: 'info',
                icon: 'subscriptions',
                title: `Pengingat: ${sub.name}`,
                message: `Jatuh tempo dalam 3 hari (Rp ${new Intl.NumberFormat('id-ID').format(sub.amount)})`,
                link: '/subscriptions',
            });
        }
    });

    return notifications;
}

/**
 * Check budget limits and generate warnings
 * @param {Array} budgets - List of budgets
 * @param {Array} transactions - List of transactions
 * @param {Array} existingNotifications - Current notifications to avoid duplicates
 * @returns {Array} New notifications to add
 */
export function checkBudgetAlerts(budgets, transactions, existingNotifications = []) {
    const notifications = [];
    const currentMonth = getCurrentMonth();

    const currentBudgets = budgets.filter(b => b.month === currentMonth);

    currentBudgets.forEach(budget => {
        const spent = getBudgetSpent(transactions, budget.category, currentMonth);
        const percentage = (spent / budget.monthlyLimit) * 100;

        // Generate notification ID based on budget and month
        const notificationId = `budget-${budget.id}-${currentMonth}-${Math.floor(percentage / 10) * 10}`;

        // Skip if notification already exists
        if (existingNotifications.some(n => n.id === notificationId)) {
            return;
        }

        // Budget exceeded
        if (percentage >= 100) {
            notifications.push({
                id: notificationId,
                type: 'alert',
                icon: 'warning',
                title: `Anggaran ${budget.category} Terlampaui!`,
                message: `Pengeluaran ${percentage.toFixed(0)}% dari batas Rp ${new Intl.NumberFormat('id-ID').format(budget.monthlyLimit)}`,
                link: '/budget',
            });
        }
        // Budget at 90%
        else if (percentage >= 90) {
            notifications.push({
                id: notificationId,
                type: 'alert',
                icon: 'pie_chart',
                title: `Anggaran ${budget.category} Hampir Habis`,
                message: `${percentage.toFixed(0)}% terpakai, sisa Rp ${new Intl.NumberFormat('id-ID').format(budget.monthlyLimit - spent)}`,
                link: '/budget',
            });
        }
        // Budget at 80%
        else if (percentage >= 80) {
            notifications.push({
                id: notificationId,
                type: 'reminder',
                icon: 'pie_chart',
                title: `Anggaran ${budget.category} 80% Terpakai`,
                message: `Sisa Rp ${new Intl.NumberFormat('id-ID').format(budget.monthlyLimit - spent)}`,
                link: '/budget',
            });
        }
    });

    return notifications;
}

/**
 * Check for goals that are close to target
 * @param {Array} goals - List of goals
 * @param {Array} existingNotifications - Current notifications
 * @returns {Array} New notifications
 */
export function checkGoalProgress(goals, existingNotifications = []) {
    const notifications = [];

    goals.forEach(goal => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        const notificationId = `goal-${goal.id}-${Math.floor(percentage / 25) * 25}`;

        if (existingNotifications.some(n => n.id === notificationId)) {
            return;
        }

        // Goal achieved
        if (percentage >= 100) {
            notifications.push({
                id: notificationId,
                type: 'success',
                icon: 'celebration',
                title: `🎉 Goal "${goal.name}" Tercapai!`,
                message: `Selamat! Kamu berhasil mengumpulkan Rp ${new Intl.NumberFormat('id-ID').format(goal.targetAmount)}`,
                link: '/goals',
            });
        }
        // 75% progress
        else if (percentage >= 75 && percentage < 100) {
            notifications.push({
                id: notificationId,
                type: 'info',
                icon: 'flag',
                title: `Goal "${goal.name}" 75% Tercapai`,
                message: `Tinggal Rp ${new Intl.NumberFormat('id-ID').format(goal.targetAmount - goal.currentAmount)} lagi!`,
                link: '/goals',
            });
        }
        // 50% progress
        else if (percentage >= 50 && percentage < 75) {
            notifications.push({
                id: notificationId,
                type: 'info',
                icon: 'flag',
                title: `Goal "${goal.name}" Setengah Jalan`,
                message: `Sudah terkumpul 50%, terus semangat!`,
                link: '/goals',
            });
        }
    });

    return notifications;
}

/**
 * Request browser notification permission
 * @returns {Promise<boolean>} Whether permission was granted
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Browser tidak mendukung notifikasi');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

/**
 * Show browser push notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export function showBrowserNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const notification = new Notification(title, {
        icon: '/goceng.png',
        badge: '/goceng.png',
        ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    return notification;
}

/**
 * Run all notification checks
 * @param {object} state - Store state
 * @returns {Array} All new notifications
 */
export function runNotificationChecks(state) {
    const { subscriptions, budgets, transactions, goals, notifications } = state;

    const newNotifications = [
        ...checkSubscriptionReminders(subscriptions, notifications),
        ...checkBudgetAlerts(budgets, transactions, notifications),
        ...checkGoalProgress(goals, notifications),
    ];

    return newNotifications;
}
