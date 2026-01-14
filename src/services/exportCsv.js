import { formatCurrency, formatDate } from './formatters';
import { getCategoryById } from '../models/categories';

/**
 * Export transactions to CSV and trigger download
 * @param {Array} transactions 
 * @param {Array} wallets - For wallet name lookup
 * @param {string} filename 
 */
export function exportTransactionsCsv(transactions, wallets, filename = 'transaksi') {
    const headers = [
        'Tanggal',
        'Tipe',
        'Kategori',
        'Deskripsi',
        'Jumlah',
        'Wallet',
        'Wallet Tujuan',
    ];

    const getWalletName = (id) => {
        const wallet = wallets.find(w => w.id === id);
        return wallet ? wallet.name : '-';
    };

    const rows = transactions.map(t => {
        const category = getCategoryById(t.category);
        return [
            formatDate(t.date, 'medium'),
            t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer',
            category ? category.name : t.category,
            t.description || '-',
            t.type === 'income' ? t.amount : -t.amount,
            getWalletName(t.walletId),
            t.walletTargetId ? getWalletName(t.walletTargetId) : '-',
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row =>
            row.map(cell => {
                // Escape quotes and wrap in quotes if contains comma
                const str = String(cell);
                if (str.includes(',') || str.includes('"')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            }).join(',')
        ),
    ].join('\n');

    downloadFile(csvContent, `${filename}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

/**
 * Export all data as JSON
 * @param {Object} data 
 * @param {string} filename 
 */
export function exportDataJson(data, filename = 'goceng-backup') {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
}

/**
 * Trigger file download
 * @param {string} content 
 * @param {string} filename 
 * @param {string} mimeType 
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
