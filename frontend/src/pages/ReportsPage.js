import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ReportFilters from '../components/ReportFilters';
import ReportStats from '../components/ReportStats';
import ReportTable from '../components/ReportTable';

function ReportsPage() {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport({});
    }, []);

    const loadReport = async (filters) => {
        setLoading(true);
        try {
            const [filteredTasks, statsData] = await Promise.all([
                api.filterTasks(filters),
                api.getStats()
            ]);
            setTasks(filteredTasks);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <h1>Reports</h1>
            </div>

            <ReportFilters onFilter={loadReport} />

            {loading ? (
                <div className="loading">Loading report...</div>
            ) : (
                <>
                    <ReportStats stats={stats} />
                    <ReportTable tasks={tasks} />
                </>
            )}
        </div>
    );
}

export default ReportsPage;
