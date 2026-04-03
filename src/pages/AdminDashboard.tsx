import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import * as constants from '../components/constants';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [selectedTable, setSelectedTable] = useState('users');
    const [tableData, setTableData] = useState<any[]>([]);
    const [filterText, setFilterText] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const validTables = [
        "users", "education", "books", "publications", "patents", "honors",
        "projects", "collaborations", "memberships", "teaching_engagements",
        "supervisions", "associate_scholars", "events", "visits",
        "administrative_positions", "miscellaneous"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear + 5 - i); // Generate last ~50 years

    useEffect(() => {
        if (UserProfile.getName() !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTableData = async () => {
            if (UserProfile.getName() !== 'admin') return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${constants.SERVER_URL}api/admin/table-data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: UserProfile.getName(),
                        table: selectedTable
                    })
                });
                const data = await response.json();
                if (data.success) {
                    setTableData(data.data);
                } else {
                    setError(data.error || 'Failed to fetch data');
                }
            } catch (err: any) {
                setError('Network error: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, [selectedTable]);

    const filteredData = tableData.filter(row => {
        // 1. Global Text Filter
        if (filterText) {
            const lowerFilter = filterText.toLowerCase();
            const textMatch = Object.values(row).some(val =>
                val !== null && val !== undefined && String(val).toLowerCase().includes(lowerFilter)
            );
            if (!textMatch) return false;
        }

        // 2. Smart Range Year Filter
        if (filterYear) {
            const targetYear = parseInt(filterYear, 10);
            const yearMatch = Object.values(row).some(val => {
                if (val === null || val === undefined) return false;
                const strVal = String(val).toLowerCase();

                // Direct match (e.g. exactly "2023" or "Jan 2023")
                if (strVal.includes(filterYear)) return true;

                // Range match (e.g. "2005-2009" or "2005 - 2009")
                const rangeMatch = strVal.match(/\b(\d{4})\s*-\s*(\d{4})\b/);
                if (rangeMatch && targetYear >= parseInt(rangeMatch[1], 10) && targetYear <= parseInt(rangeMatch[2], 10)) return true;

                // Present match (e.g. "2020-Present" or "2020 - current")
                const presentMatch = strVal.match(/\b(\d{4})\s*-\s*(present|current|now)\b/);
                if (presentMatch && targetYear >= parseInt(presentMatch[1], 10) && targetYear <= currentYear) return true;

                return false;
            });
            if (!yearMatch) return false;
        }
        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filterText, filterYear, selectedTable]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleDownloadCSV = () => {
        if (!filteredData || filteredData.length === 0) return;

        const headers = Object.keys(filteredData[0]);
        const escapeCSV = (val: any) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [headers.map(escapeCSV).join(',')];
        for (const row of filteredData) {
            csvRows.push(headers.map((h) => escapeCSV(row[h])).join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedTable}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (UserProfile.getName() !== 'admin') {
        return <div className="p-8 text-center text-red-500 font-bold">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1A365D]">Admin Dashboard</h1>
                    <button onClick={() => navigate('/')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors">Go Back</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Database Table</label>
                        <select
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                        >
                            {validTables.map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Filter by Year</label>
                        <select
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Filter Results</label>
                        <input
                            type="text"
                            placeholder="Type to search in all columns..."
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md font-semibold">{error}</div>}

                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-[#1A365D] capitalize">{selectedTable.replace(/_/g, ' ')} Data</h2>
                    <button
                        onClick={handleDownloadCSV}
                        disabled={filteredData.length === 0}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Download CSV
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500 font-semibold animate-pulse">Loading data...</div>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-[#1A365D]">
                                <tr>
                                    {tableData.length > 0 ? Object.keys(tableData[0]).map((key) => (
                                        <th key={key} className="px-4 py-3 text-left font-bold text-white uppercase tracking-wider">{key.replace('_', ' ')}</th>
                                    )) : <th className="px-4 py-3 text-left text-white">No columns found</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.length > 0 ? paginatedData.map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                                        {Object.values(row).map((val: any, j) => (
                                            <td key={j} className="px-4 py-3 whitespace-nowrap text-gray-800">
                                                {val !== null && val !== undefined ? String(val) : <span className="text-gray-400 italic">null</span>}
                                            </td>
                                        ))}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={tableData.length > 0 ? Object.keys(tableData[0]).length : 1} className="px-4 py-12 text-center text-gray-500 italic">
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 bg-white p-4 border border-gray-200 rounded-md shadow-sm gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                            <span>Show</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="border border-gray-300 rounded p-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {[10, 25, 50, 100].map(val => <option key={val} value={val}>{val}</option>)}
                            </select>
                            <span>entries</span>
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">
                            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;