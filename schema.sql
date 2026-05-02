CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

-- Categories for organizing tasks
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7)
);

-- Tags for flexible labeling
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Main tasks table (this is the "one main table" for Requirement 1)
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Junction table for many-to-many relationship (supporting table for Requirement 1)
CREATE TABLE IF NOT EXISTS task_tags (
    task_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Comments table (supporting table for Requirement 1)
CREATE TABLE IF NOT EXISTS task_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- ===== INDEXES (Stage 3) =====
-- These indexes support the report filter query which filters by category, status, priority, and date range.
-- Without indexes, the database performs full table scans on these columns for every filter request.

-- Index on category_id: supports filtering tasks by category in the report (GET /api/tasks/filter?categoryId=X)
-- and the GROUP BY query for "tasks by category" statistics.
CREATE INDEX idx_tasks_category_id ON tasks(category_id);

-- Index on status: supports filtering tasks by status in the report (GET /api/tasks/filter?status=X)
-- and the overdue tasks query which filters WHERE status NOT IN ('COMPLETED','CANCELLED').
CREATE INDEX idx_tasks_status ON tasks(status);

-- Index on priority: supports filtering tasks by priority in the report (GET /api/tasks/filter?priority=X)
-- and the GROUP BY query for "tasks by priority" statistics.
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Index on due_date: supports the date range filter in the report (WHERE due_date >= ? AND due_date <= ?)
-- and the overdue tasks query (WHERE due_date < TODAY).
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Composite index on (status, due_date): optimizes the overdue tasks query which filters on both columns
-- simultaneously: WHERE due_date < TODAY AND status NOT IN ('COMPLETED','CANCELLED').
CREATE INDEX idx_tasks_status_due_date ON tasks(status, due_date);

-- Index on task_id in comments: supports loading comments for a specific task (GET /api/tasks/{id}/comments).
-- This is a frequent query executed every time a user views task details.
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);

-- Index on tag name: supports tag lookup by name when associating tags with tasks during create/update.
-- The query tagRepository.findByName(tagName) runs for every tag when saving a task.
CREATE INDEX idx_tags_name ON tags(name);
