import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import * as constants from '../components/constants';

const DevSQL = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Redirect non-dev users immediately
    useEffect(() => {
        if (UserProfile.getName() !== 'dev') {
            navigate('/');
        }
    }, [navigate]);

    const handleExecute = async () => {
        setError(null);
        setResults(null);
        setMessage(null);

        if (!query.trim()) {
            setError("Please enter a SQL query.");
            return;
        }

        try {
            const response = await fetch(`${constants.SERVER_URL}api/execute-sql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: UserProfile.getName(),
                    query: query
                })
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.rows);
                setMessage(`Execution successful: ${data.command} (${data.rowCount || 0} rows affected)`);
            } else {
                setError(data.error || 'Execution failed');
            }
        } catch (err: any) {
            setError('Failed to connect to the server: ' + err.message);
        }
    };

    const handleDownloadCSV = () => {
        if (!results || results.length === 0) return;

        const headers = Object.keys(results[0]);
        const escapeCSV = (val: any) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [headers.map(escapeCSV).join(',')];
        for (const row of results) {
            csvRows.push(headers.map((h) => escapeCSV(row[h])).join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'query_results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (UserProfile.getName() !== 'dev') {
        return <div className="p-8 text-center text-red-500 font-bold">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-[#1A365D] mb-2">Developer SQL Console</h1>
                <p className="text-sm text-red-600 mb-6 font-semibold">Warning: Executing arbitrary SQL can modify or destroy data. Use with caution.</p>

                <textarea
                    className="w-full h-40 p-4 bg-gray-900 text-green-400 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SELECT * FROM users;"
                />

                <button
                    onClick={handleExecute}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-bold"
                >
                    Execute Query
                </button>

                {error && (
                    <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {message && (
                    <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-400 rounded-md font-medium">
                        {message}
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-[#1A365D]">Query Results</h3>
                            <button
                                onClick={handleDownloadCSV}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-bold text-sm"
                            >
                                Download CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto border border-gray-200 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(results[0]).map((key) => (
                                            <th key={key} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {results.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            {Object.values(row).map((val: any, j) => (
                                                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{val !== null && val !== undefined ? val.toString() : <span className="text-gray-400 italic">null</span>}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {results && results.length === 0 && (
                    <div className="mt-6 text-gray-500 italic">No rows returned.</div>
                )}
            </div>
        </div>
    );
};

export default DevSQL;