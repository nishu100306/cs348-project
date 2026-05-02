import React from 'react';

function ReportStats({ stats }) {
    if (!stats) return null;

    return (
        <div className="report-stats">
            <h3>Statistics</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.totalTasks || 0}</div>
                    <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.completedTasks || 0}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.completionRate || 0}%</div>
                    <div className="stat-label">Completion Rate</div>
                </div>
                <div className="stat-card stat-overdue">
                    <div className="stat-value">{stats.overdueCount || 0}</div>
                    <div className="stat-label">Overdue</div>
                </div>
            </div>

            <div className="stats-breakdown">
                {stats.tasksByPriority && Object.keys(stats.tasksByPriority).length > 0 && (
                    <div className="breakdown-section">
                        <h4>Tasks by Priority</h4>
                        <div className="breakdown-list">
                            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                                <div key={priority} className="breakdown-item">
                                    <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                                        {priority}
                                    </span>
                                    <span className="breakdown-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {stats.tasksByCategory && Object.keys(stats.tasksByCategory).length > 0 && (
                    <div className="breakdown-section">
                        <h4>Tasks by Category</h4>
                        <div className="breakdown-list">
                            {Object.entries(stats.tasksByCategory).map(([category, count]) => (
                                <div key={category} className="breakdown-item">
                                    <span>{category}</span>
                                    <span className="breakdown-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportStats;
