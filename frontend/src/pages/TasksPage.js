import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskDetails from '../components/TaskDetails';
import CategoryManager from '../components/CategoryManager';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    // Ref to scroll to the form when editing
    const formRef = useRef(null);

    useEffect(() => {
        loadTasks();
    }, []);

    // Scroll to form whenever it becomes visible
    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm, editingTask]);

    const loadTasks = async () => {
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        try {
            await api.createTask(formData);
            setShowForm(false);
            loadTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateTask(editingTask.id, formData);
            setEditingTask(null);
            setShowForm(false);
            loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.deleteTask(id);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="tasks-page">
            <div className="page-header">
                <h1>Tasks</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
                        + Add Task
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowCategoryManager(true)}>
                        Manage Categories
                    </button>
                </div>
            </div>

            <TaskList
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={setSelectedTask}
                editingTaskId={editingTask?.id}
                showForm={showForm}
                formRef={formRef}
                formElement={
                    showForm ? (
                        <TaskForm
                            task={editingTask}
                            onSubmit={editingTask ? handleUpdate : handleCreate}
                            onCancel={handleCancel}
                        />
                    ) : null
                }
            />

            {/* Show form at top only when creating (not editing) */}
            {showForm && !editingTask && (
                <div ref={formRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: 0, pointerEvents: 'none' }}>
                    {/* Hidden anchor for scroll — actual form is rendered inside TaskList above the list */}
                </div>
            )}

            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {showCategoryManager && (
                <CategoryManager onClose={() => setShowCategoryManager(false)} />
            )}
        </div>
    );
}

export default TasksPage;
