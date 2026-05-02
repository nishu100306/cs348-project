import React from 'react';
import CommentSection from './CommentSection';

function TaskDetails({ task, onClose }) {
    if (!task) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task.title}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="task-details-body">
                    <div className="detail-row">
                        <strong>Description:</strong>
                        <p>{task.description || 'No description'}</p>
                    </div>
                    <div className="detail-row">
                        <strong>Category:</strong>
                        <span>{task.category ? task.category.name : 'None'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Priority:</strong>
                        <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                            {task.priority}
                        </span>
                    </div>
                    <div className="detail-row">
                        <strong>Status:</strong>
                        <span>{task.status?.replace('_', ' ')}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Due Date:</strong>
                        <span>{task.dueDate || 'Not set'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Created:</strong>
                        <span>{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    {task.tags && task.tags.length > 0 && (
                        <div className="detail-row">
                            <strong>Tags:</strong>
                            <div className="task-tags">
                                {task.tags.map(tag => (
                                    <span key={tag.id} className="tag-badge">{tag.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <hr />

                {/* Comments section - supporting table operations */}
                <CommentSection taskId={task.id} />
            </div>
        </div>
    );
}

export default TaskDetails;
