import { useState, useEffect } from 'react';

export const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\./g, '');
};

/**
 * Formatted number input component
 * Handles thousand separators (dots) and removes default 0
 */
export default function FormattedNumberInput({
    value,
    onChange,
    placeholder = "0",
    className,
    error
}) {
    const [displayValue, setDisplayValue] = useState('');

    // Sync display value when prop changes
    useEffect(() => {
        if (value !== undefined && value !== null) {
            // If value is 0 and we haven't typed yet, keep it empty or 0 dependent on focus? 
            // User requested "default 0 changed to empty", usually implies placeholder handles it
            if (value === 0) {
                setDisplayValue('');
            } else {
                setDisplayValue(formatNumber(value));
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        const parsed = rawValue ? parseInt(rawValue, 10) : 0;

        // Update local display immediately for smooth typing
        setDisplayValue(formatNumber(rawValue));

        // Propagate up parsed number (or 0 if empty)
        onChange(parsed);
    };

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={className}
            placeholder={placeholder}
            inputMode="numeric"
        />
    );
}
