import Modal from './Modal';

/**
 * Confirmation dialog for destructive actions
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {function} props.onClose - Close handler
 * @param {function} props.onConfirm - Confirm handler
 * @param {string} [props.title] - Dialog title
 * @param {string} [props.message] - Confirmation message
 * @param {string} [props.confirmLabel] - Confirm button label
 * @param {string} [props.cancelLabel] - Cancel button label
 * @param {boolean} [props.danger] - Whether action is dangerous (red button)
 */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    danger = false,
}) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-text-muted mb-6">{message}</p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg bg-surface-highlight text-white font-medium hover:bg-surface-highlight/80 transition-colors"
                >
                    {cancelLabel}
                </button>
                <button
                    onClick={handleConfirm}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${danger
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                >
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
