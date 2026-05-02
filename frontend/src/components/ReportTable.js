import React from 'react';

function ReportTable({ tasks }) {
    if (!tasks || tasks.length === 0) {
        return <div className="empty-state">No tasks match the current filters.</div>;
    }

    return (
        <div className="report-table-container">
            <h3>Filtered Results ({tasks.length} tasks)</h3>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>
                                {task.category ? (
                                    <span className="category-badge" style={{ backgroundColor: task.category.color || '#666' }}>
                                        {task.category.name}
                                    </span>
                                ) : '-'}
                            </td>
                            <td>
                                <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            </td>
                            <td>
                                <span className={`status-badge status-${task.status?.toLowerCase().replace('_', '-')}`}>
                                    {task.status?.replace('_', ' ')}
                                </span>
                            </td>
                            <td>{task.dueDate || '-'}</td>
                            <td>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReportTable;
