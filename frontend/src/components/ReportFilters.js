import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function ReportFilters({ onFilter }) {
    const [filters, setFilters] = useState({
        categoryId: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: ''
    });

    // CRITICAL: Categories loaded from database for filter dropdown
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.getCategories().then(setCategories);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        // Remove empty values before sending
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        );
        onFilter(activeFilters);
    };

    const handleClear = () => {
        setFilters({ categoryId: '', status: '', priority: '', startDate: '', endDate: '' });
        onFilter({});
    };

    return (
        <div className="report-filters">
            <h3>Filter Tasks</h3>
            <div className="filters-grid">
                {/* Category Filter - FROM DATABASE */}
                <div className="filter-group">
                    <label>Category (from database)</label>
                    <select name="categoryId" value={filters.categoryId} onChange={handleChange}>
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                    <label>Status</label>
                    <select name="status" value={filters.status} onChange={handleChange}>
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div className="filter-group">
                    <label>Priority</label>
                    <select name="priority" value={filters.priority} onChange={handleChange}>
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                {/* Date Range */}
                <div className="filter-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                </div>
                <div className="filter-group">
                    <label>End Date</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                </div>
            </div>

            <div className="filter-actions">
                <button className="btn btn-primary" onClick={handleFilter}>Generate Report</button>
                <button className="btn btn-secondary" onClick={handleClear}>Clear Filters</button>
            </div>
        </div>
    );
}

export default ReportFilters;
