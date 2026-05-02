import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function CategoryManager({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState('#3357FF');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.createCategory({ name: newName, color: newColor });
            setNewName('');
            setNewColor('#3357FF');
            loadCategories();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await api.updateCategory(id, { name: editName, color: editColor });
            setEditingId(null);
            loadCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.deleteCategory(id);
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditColor(category.color || '#3357FF');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Categories</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form className="category-form" onSubmit={handleCreate}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New category name"
                        required
                    />
                    <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-small">Add</button>
                </form>

                <div className="categories-list">
                    {categories.map(cat => (
                        <div key={cat.id} className="category-item">
                            {editingId === cat.id ? (
                                <div className="category-edit">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <input
                                        type="color"
                                        value={editColor}
                                        onChange={(e) => setEditColor(e.target.value)}
                                    />
                                    <button className="btn btn-small btn-primary" onClick={() => handleUpdate(cat.id)}>Save</button>
                                    <button className="btn btn-small btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="category-display">
                                    <span className="category-color" style={{ backgroundColor: cat.color || '#666' }}></span>
                                    <span className="category-name">{cat.name}</span>
                                    <button className="btn btn-small btn-edit" onClick={() => startEdit(cat)}>Edit</button>
                                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryManager;
