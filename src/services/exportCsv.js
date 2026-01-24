import { formatDate } from './formatters';
import { getCategoryById } from '../models/categories';
import XLSX from 'xlsx-js-style';

/**
 * Export transactions to XLSX with styled header
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

    // Create styled header row
    const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '3399FF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
        }
    };

    const styledHeaders = headers.map(h => ({ v: h, t: 's', s: headerStyle }));

    // Create data rows
    const dataRows = transactions.map(t => {
        const category = getCategoryById(t.category);
        const cellStyle = {
            border: {
                top: { style: 'thin', color: { rgb: 'CCCCCC' } },
                bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
                left: { style: 'thin', color: { rgb: 'CCCCCC' } },
                right: { style: 'thin', color: { rgb: 'CCCCCC' } },
            }
        };
        return [
            { v: formatDate(t.date, 'medium'), t: 's', s: cellStyle },
            { v: t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer', t: 's', s: cellStyle },
            { v: category ? category.name : t.category, t: 's', s: cellStyle },
            { v: t.description || '-', t: 's', s: cellStyle },
            { v: t.type === 'income' ? t.amount : -t.amount, t: 'n', s: { ...cellStyle, numFmt: '#,##0' } },
            { v: getWalletName(t.walletId), t: 's', s: cellStyle },
            { v: t.walletTargetId ? getWalletName(t.walletTargetId) : '-', t: 's', s: cellStyle },
        ];
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([styledHeaders, ...dataRows]);

    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // Tanggal
        { wch: 12 }, // Tipe
        { wch: 15 }, // Kategori
        { wch: 25 }, // Deskripsi
        { wch: 15 }, // Jumlah
        { wch: 15 }, // Wallet
        { wch: 15 }, // Wallet Tujuan
    ];

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');

    // Generate and download file
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
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
