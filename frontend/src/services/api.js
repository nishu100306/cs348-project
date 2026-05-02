const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const api = {
    // Categories - for dynamic dropdowns (Requirement C)
    getCategories: () => fetch(`${API_BASE}/categories`).then(res => res.json()),
    createCategory: (data) => fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateCategory: (id, data) => fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteCategory: (id) => fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' }),

    // Tags - for dynamic multi-select (Requirement C)
    getTags: () => fetch(`${API_BASE}/tags`).then(res => res.json()),
    createTag: (data) => fetch(`${API_BASE}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Tasks - Main CRUD (Requirement 1)
    getTasks: () => fetch(`${API_BASE}/tasks`).then(res => res.json()),
    getTask: (id) => fetch(`${API_BASE}/tasks/${id}`).then(res => res.json()),
    createTask: (data) => fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateTask: (id, data) => fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }),

    // Filtering and Stats (Requirement 2)
    filterTasks: (params) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/tasks/filter?${query}`).then(res => res.json());
    },
    getStats: () => fetch(`${API_BASE}/tasks/stats`).then(res => res.json()),

    // Comments (Supporting table operations)
    getComments: (taskId) => fetch(`${API_BASE}/tasks/${taskId}/comments`).then(res => res.json()),
    addComment: (taskId, content) => fetch(`${API_BASE}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    }).then(res => res.json()),
    deleteComment: (commentId) => fetch(`${API_BASE}/comments/${commentId}`, { method: 'DELETE' }),
};
