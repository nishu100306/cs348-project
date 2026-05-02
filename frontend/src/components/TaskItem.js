import React from 'react';

function TaskItem({ task, onEdit, onDelete, onViewDetails }) {
    const priorityClass = `priority-${task.priority?.toLowerCase()}`;
    const statusClass = `status-${task.status?.toLowerCase().replace('_', '-')}`;

    return (
        <div className={`task-item ${priorityClass}`}>
            <div className="task-item-header">
                <h3 className="task-title" onClick={() => onViewDetails(task)}>
                    {task.title}
                </h3>
                <span className={`status-badge ${statusClass}`}>
                    {task.status?.replace('_', ' ')}
                </span>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-meta">
                {task.category && (
                    <span className="category-badge" style={{ backgroundColor: task.category.color || '#666' }}>
                        {task.category.name}
                    </span>
                )}
                <span className={`priority-badge ${priorityClass}`}>
                    {task.priority}
                </span>
                {task.dueDate && (
                    <span className="due-date">Due: {task.dueDate}</span>
                )}
            </div>

            {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                    {task.tags.map(tag => (
                        <span key={tag.id} className="tag-badge">{tag.name}</span>
                    ))}
                </div>
            )}

            <div className="task-actions">
                <button className="btn btn-small btn-edit" onClick={() => onEdit(task)}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
                <button className="btn btn-small btn-info" onClick={() => onViewDetails(task)}>Details</button>
            </div>
        </div>
    );
}

export default TaskItem;
