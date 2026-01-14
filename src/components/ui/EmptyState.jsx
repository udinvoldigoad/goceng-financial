/**
 * Empty state component for lists with no data
 * @param {Object} props
 * @param {string} props.icon - Material icon name
 * @param {string} props.title - Main message
 * @param {string} [props.description] - Secondary message
 * @param {string} [props.actionLabel] - CTA button label
 * @param {function} [props.onAction] - CTA button handler
 */
export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-text-muted">
                    {icon}
                </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-text-muted text-sm max-w-sm mb-6">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
