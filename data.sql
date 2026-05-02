USE taskmanager;

-- Categories
INSERT INTO categories (name, color) VALUES
('Work', '#FF5733'),
('Personal', '#33FF57'),
('School', '#3357FF'),
('Health', '#FF33F5');

-- Tags
INSERT INTO tags (name) VALUES
('urgent'),
('important'),
('optional'),
('recurring'),
('meeting');

-- Tasks with variety for good demo
INSERT INTO tasks (category_id, title, description, priority, status, due_date, created_at) VALUES
(1, 'Complete project proposal', 'Write the Q1 project proposal document', 'HIGH', 'IN_PROGRESS', '2025-02-01', NOW()),
(1, 'Team meeting preparation', 'Prepare slides for weekly sync', 'MEDIUM', 'PENDING', '2025-01-25', NOW()),
(2, 'Grocery shopping', 'Buy groceries for the week', 'LOW', 'PENDING', '2025-01-23', NOW()),
(3, 'CS348 Database Project', 'Complete Stage 2 deliverables', 'HIGH', 'IN_PROGRESS', '2025-01-30', NOW()),
(4, 'Morning workout', 'Go to gym - leg day', 'MEDIUM', 'COMPLETED', '2025-01-20', NOW()),
(1, 'Code review', 'Review pull requests from team', 'MEDIUM', 'PENDING', '2025-01-22', NOW()),
(3, 'Study for midterm', 'Review chapters 5-8 for exam', 'HIGH', 'PENDING', '2025-01-28', NOW()),
(2, 'Call mom', 'Weekly family call', 'LOW', 'COMPLETED', '2025-01-19', NOW()),
(4, 'Doctor appointment', 'Annual checkup', 'HIGH', 'PENDING', '2025-02-05', NOW()),
(1, 'Submit expense report', 'Q4 expenses', 'LOW', 'CANCELLED', '2025-01-15', NOW());

-- Task-Tag associations
INSERT INTO task_tags (task_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 5),
(4, 1), (4, 2),
(5, 4),
(7, 1),
(9, 2);

-- Comments
INSERT INTO task_comments (task_id, content, created_at) VALUES
(1, 'Started the outline today', NOW()),
(1, 'Need to add budget section', NOW()),
(4, 'Finished Stage 1 submission', NOW()),
(4, 'Working on database schema now', NOW()),
(7, 'Made flashcards for chapter 5', NOW());
