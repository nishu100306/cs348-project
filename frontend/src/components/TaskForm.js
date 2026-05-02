import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function TaskForm({ task, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: '',
        categoryId: '',
        tagNames: []
    });

    // State for dynamic dropdown options - FETCHED FROM DATABASE
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories and tags from database on component mount
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [categoriesData, tagsData] = await Promise.all([
                    api.getCategories(),  // GET /api/categories
                    api.getTags()         // GET /api/tags
                ]);
                setCategories(categoriesData);
                setTags(tagsData);
            } catch (error) {
                console.error('Error loading dropdown data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDropdownData();
    }, []);

    // Pre-fill form when editing an existing task
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'MEDIUM',
                status: task.status || 'PENDING',
                dueDate: task.dueDate || '',
                categoryId: task.category ? task.category.id : '',
                tagNames: task.tags ? task.tags.map(t => t.name) : []
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagToggle = (tagName) => {
        setFormData(prev => ({
            ...prev,
            tagNames: prev.tagNames.includes(tagName)
                ? prev.tagNames.filter(t => t !== tagName)
                : [...prev.tagNames, tagName]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            categoryId: formData.categoryId ? Number(formData.categoryId) : null
        };
        onSubmit(submitData);
    };

    if (loading) return <div className="loading">Loading form...</div>;

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>

            <div className="form-group">
                <label>Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="3"
                />
            </div>

            {/* Category Dropdown - DYNAMICALLY POPULATED FROM DATABASE */}
            <div className="form-group">
                <label>Category (loaded from database)</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tags Multi-select - DYNAMICALLY POPULATED FROM DATABASE */}
            <div className="form-group">
                <label>Tags (loaded from database)</label>
                <div className="tags-selection">
                    {tags.map(tag => (
                        <label key={tag.id} className="tag-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.tagNames.includes(tag.name)}
                                onChange={() => handleTagToggle(tag.name)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Priority - enum values, not from DB */}
            <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
            </div>

            {/* Status */}
            <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    {task ? 'Update Task' : 'Create Task'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
