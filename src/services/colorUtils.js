/**
 * Color utility classes for dynamic Tailwind colors
 * This solves the issue of dynamic class names not being included in production builds
 * because Tailwind purges unused classes at build time.
 */

// All colors used in the application
const COLOR_MAP = {
    // Background colors with opacity
    bgLight: {
        red: 'bg-red-500/10',
        orange: 'bg-orange-500/10',
        yellow: 'bg-yellow-500/10',
        green: 'bg-green-500/10',
        teal: 'bg-teal-500/10',
        cyan: 'bg-cyan-500/10',
        blue: 'bg-blue-500/10',
        indigo: 'bg-indigo-500/10',
        purple: 'bg-purple-500/10',
        pink: 'bg-pink-500/10',
        gray: 'bg-gray-500/10',
    },
    bgLight20: {
        red: 'bg-red-500/20',
        orange: 'bg-orange-500/20',
        yellow: 'bg-yellow-500/20',
        green: 'bg-green-500/20',
        teal: 'bg-teal-500/20',
        cyan: 'bg-cyan-500/20',
        blue: 'bg-blue-500/20',
        indigo: 'bg-indigo-500/20',
        purple: 'bg-purple-500/20',
        pink: 'bg-pink-500/20',
        gray: 'bg-gray-500/20',
    },
    bgDark: {
        red: 'bg-red-900/20',
        orange: 'bg-orange-900/20',
        yellow: 'bg-yellow-900/20',
        green: 'bg-green-900/20',
        teal: 'bg-teal-900/20',
        cyan: 'bg-cyan-900/20',
        blue: 'bg-blue-900/20',
        indigo: 'bg-indigo-900/20',
        purple: 'bg-purple-900/20',
        pink: 'bg-pink-900/20',
        gray: 'bg-gray-900/20',
    },
    bgDark30: {
        red: 'bg-red-900/30',
        orange: 'bg-orange-900/30',
        yellow: 'bg-yellow-900/30',
        green: 'bg-green-900/30',
        teal: 'bg-teal-900/30',
        cyan: 'bg-cyan-900/30',
        blue: 'bg-blue-900/30',
        indigo: 'bg-indigo-900/30',
        purple: 'bg-purple-900/30',
        pink: 'bg-pink-900/30',
        gray: 'bg-gray-900/30',
    },
    bgDark50: {
        red: 'bg-red-900/50',
        orange: 'bg-orange-900/50',
        yellow: 'bg-yellow-900/50',
        green: 'bg-green-900/50',
        teal: 'bg-teal-900/50',
        cyan: 'bg-cyan-900/50',
        blue: 'bg-blue-900/50',
        indigo: 'bg-indigo-900/50',
        purple: 'bg-purple-900/50',
        pink: 'bg-pink-900/50',
        gray: 'bg-gray-900/50',
    },
    // Text colors
    text: {
        red: 'text-red-400',
        orange: 'text-orange-400',
        yellow: 'text-yellow-400',
        green: 'text-green-400',
        teal: 'text-teal-400',
        cyan: 'text-cyan-400',
        blue: 'text-blue-400',
        indigo: 'text-indigo-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        gray: 'text-gray-400',
    },
    // Border colors
    border: {
        red: 'border-red-500',
        orange: 'border-orange-500',
        yellow: 'border-yellow-500',
        green: 'border-green-500',
        teal: 'border-teal-500',
        cyan: 'border-cyan-500',
        blue: 'border-blue-500',
        indigo: 'border-indigo-500',
        purple: 'border-purple-500',
        pink: 'border-pink-500',
        gray: 'border-gray-500',
    },
    // Ring colors
    ring: {
        red: 'ring-red-500',
        orange: 'ring-orange-500',
        yellow: 'ring-yellow-500',
        green: 'ring-green-500',
        teal: 'ring-teal-500',
        cyan: 'ring-cyan-500',
        blue: 'ring-blue-500',
        indigo: 'ring-indigo-500',
        purple: 'ring-purple-500',
        pink: 'ring-pink-500',
        gray: 'ring-gray-500',
    },
};

/**
 * Get background color class with light opacity (10%)
 * @param {string} color - Color name (red, blue, green, etc.)
 * @param {string} fallback - Fallback color if color not found
 * @returns {string} Tailwind class
 */
export function getBgLight(color, fallback = 'gray') {
    return COLOR_MAP.bgLight[color] || COLOR_MAP.bgLight[fallback];
}

/**
 * Get background color class with medium opacity (20%)
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getBgLight20(color, fallback = 'gray') {
    return COLOR_MAP.bgLight20[color] || COLOR_MAP.bgLight20[fallback];
}

/**
 * Get dark background color class (900/20)
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getBgDark(color, fallback = 'gray') {
    return COLOR_MAP.bgDark[color] || COLOR_MAP.bgDark[fallback];
}

/**
 * Get dark background color class (900/30)
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getBgDark30(color, fallback = 'gray') {
    return COLOR_MAP.bgDark30[color] || COLOR_MAP.bgDark30[fallback];
}

/**
 * Get dark background color class (900/50)
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getBgDark50(color, fallback = 'gray') {
    return COLOR_MAP.bgDark50[color] || COLOR_MAP.bgDark50[fallback];
}

/**
 * Get text color class
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getTextColor(color, fallback = 'gray') {
    return COLOR_MAP.text[color] || COLOR_MAP.text[fallback];
}

/**
 * Get border color class
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getBorderColor(color, fallback = 'gray') {
    return COLOR_MAP.border[color] || COLOR_MAP.border[fallback];
}

/**
 * Get ring color class
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @returns {string} Tailwind class
 */
export function getRingColor(color, fallback = 'gray') {
    return COLOR_MAP.ring[color] || COLOR_MAP.ring[fallback];
}

/**
 * Get combined icon container classes (background + text)
 * @param {string} color - Color name
 * @param {string} fallback - Fallback color
 * @param {string} variant - 'light' (500/20), 'dark' (900/20), 'dark30' (900/30)
 * @returns {string} Combined Tailwind classes
 */
export function getIconContainerClasses(color, fallback = 'gray', variant = 'dark') {
    const bgClass = variant === 'light'
        ? getBgLight20(color, fallback)
        : variant === 'dark30'
            ? getBgDark30(color, fallback)
            : getBgDark(color, fallback);
    const textClass = getTextColor(color, fallback);
    return `${bgClass} ${textClass}`;
}

/**
 * Get selected state classes for category/icon selection
 * @param {string} color - Color name
 * @param {boolean} isSelected - Whether item is selected
 * @returns {string} Combined Tailwind classes
 */
export function getSelectedClasses(color, isSelected) {
    if (!isSelected) {
        return 'bg-surface-highlight border-transparent hover:border-white/20';
    }
    return `${getBgDark30(color)} ${getBorderColor(color)} ring-1 ${getRingColor(color)}`;
}
