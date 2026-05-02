import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onEdit, onDelete, onViewDetails, editingTaskId, showForm, formRef, formElement }) {
    if (tasks.length === 0 && !showForm) {
        return <div className="empty-state">No tasks found. Create one to get started!</div>;
    }

    return (
        <div className="task-list">
            {/* Show form at top when creating a new task (not editing) */}
            {showForm && !editingTaskId && (
                <div ref={formRef}>
                    {formElement}
                </div>
            )}

            {tasks.map(task => (
                <React.Fragment key={task.id}>
                    {/* Show form directly above the task being edited */}
                    {showForm && editingTaskId === task.id && (
                        <div ref={formRef}>
                            {formElement}
                        </div>
                    )}
                    <TaskItem
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewDetails={onViewDetails}
                    />
                </React.Fragment>
            ))}
        </div>
    );
}

export default TaskList;
