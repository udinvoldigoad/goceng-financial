/**
 * @typedef {'bank'|'ewallet'|'cash'|'savings'|'investment'} WalletType
 */

/**
 * @typedef {Object} Wallet
 * @property {string} id
 * @property {string} name
 * @property {WalletType} type
 * @property {string} [accountNumber]
 * @property {number} balance
 * @property {string} [icon]
 * @property {string} [color]
 * @property {boolean} [isPrimary]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Asset
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} value
 * @property {string} [walletId]
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {'income'|'expense'|'transfer'} TransactionType
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {TransactionType} type
 * @property {number} amount
 * @property {string} category
 * @property {string} walletId
 * @property {string} [walletTargetId]
 * @property {string} date
 * @property {string} [description]
 * @property {string[]} [tags]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Budget
 * @property {string} id
 * @property {string} category
 * @property {number} monthlyLimit
 * @property {string} month - YYYY-MM format
 * @property {string} [icon]
 * @property {string} [color]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} name
 * @property {number} targetAmount
 * @property {number} currentAmount
 * @property {string} [deadline]
 * @property {string} [notes]
 * @property {string} [icon]
 * @property {string} [color]
 * @property {string} createdAt
 */

/**
 * @typedef {'monthly'|'weekly'|'yearly'} SubscriptionCycle
 */

/**
 * @typedef {'active'|'paused'|'cancelled'} SubscriptionStatus
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id
 * @property {string} name
 * @property {number} amount
 * @property {SubscriptionCycle} cycle
 * @property {string} nextDueDate
 * @property {string} walletId
 * @property {SubscriptionStatus} status
 * @property {string} [icon]
 * @property {string} [color]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Settings
 * @property {'dark'|'light'} theme
 * @property {string} currency
 * @property {string} locale
 * @property {string} memberSince
 */

export { };
