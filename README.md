# CS348 Task Manager Project

A full-stack Task Manager application built with Spring Boot and React for the CS348 Database Systems course.

## Tech Stack
- **Backend**: Spring Boot 4.x, Spring Data JPA, Hibernate
- **Frontend**: React 19, React Router
- **Database**: MySQL 8

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8

## Setup

### 1. Database Setup
```bash
mysql -u root -p < schema.sql
mysql -u root -p < data.sql
```

Or run in MySQL Workbench:
1. Open and execute `schema.sql` to create tables
2. Open and execute `data.sql` to insert sample data

### 2. Backend Setup
```bash
cd backend
# Update src/main/resources/application.properties with your MySQL password
./mvnw spring-boot:run
```
Backend runs on http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## Project Structure

### Database Tables
- **categories** - Task categories (Work, Personal, School, Health)
- **tags** - Flexible labels (urgent, important, optional, etc.)
- **tasks** - Main table with foreign key to categories
- **task_tags** - Junction table for many-to-many relationship between tasks and tags
- **task_comments** - Comments on tasks with foreign key to tasks

### API Endpoints
- `GET/POST/PUT/DELETE /api/categories` - Category CRUD
- `GET/POST /api/tags` - Tag operations
- `GET/POST/PUT/DELETE /api/tasks` - Task CRUD
- `GET /api/tasks/filter` - Filter tasks by category, status, priority, date range
- `GET /api/tasks/stats` - Get task statistics
- `GET/POST /api/tasks/{id}/comments` - Task comments
- `DELETE /api/comments/{id}` - Delete comment

## Academic Requirements Demonstrated

### Requirement 1: CRUD Interface
- Create, Read, Update, Delete tasks (main table)
- Tasks reference Categories (supporting table via foreign key)
- Tasks have Tags (supporting table via junction table task_tags)
- Tasks have Comments (supporting table via foreign key)

### Requirement 2: Report Interface
- Filter by category, status, priority, date range
- Statistics: total tasks, completion rate, overdue count, tasks by priority/category
- Before/After demo: change task status, regenerate report to see updated stats

### Requirement C: Dynamic UI Components
- Category dropdown in TaskForm fetches from `GET /api/categories`
- Tags checkboxes in TaskForm fetch from `GET /api/tags`
- Category filter in ReportFilters fetches from `GET /api/categories`
- No hardcoded arrays for database-sourced data

## Stage 3: Course Concepts

### SQL Injection Protection
- **Prepared Statements**: Spring Data JPA uses parameterized queries for all database operations. The `@Query` annotations in `TaskRepository.java` use named parameters (`:categoryId`, `:status`, etc.) which are bound via `@Param` — values are never concatenated into SQL strings.
- **Input Validation**: `TaskService.validateTaskRequest()` validates all user input (length limits, enum validation, empty checks) before it reaches the database layer. `CategoryController` validates name length and hex color format.
- See: `TaskService.java` (validateTaskRequest method), `TaskRepository.java` (@Query with @Param), `CategoryController.java` (input validation)

### Indexes
All indexes are defined in `schema.sql`. Each supports specific queries:
- `idx_tasks_category_id` — Report filter by category (`GET /api/tasks/filter?categoryId=X`) and "tasks by category" statistics
- `idx_tasks_status` — Report filter by status and overdue tasks query
- `idx_tasks_priority` — Report filter by priority and "tasks by priority" statistics
- `idx_tasks_due_date` — Report date range filter (`WHERE due_date >= ? AND due_date <= ?`)
- `idx_tasks_status_due_date` — Composite index for overdue tasks query (`WHERE due_date < TODAY AND status NOT IN (...)`)
- `idx_task_comments_task_id` — Loading comments for task details view
- `idx_tags_name` — Tag lookup by name during task create/update

### Transactions and Isolation Levels
Configured in `TaskService.java` using Spring's `@Transactional` annotation:
- **READ_COMMITTED** for read-only operations (getAllTasks, filterTasks, getComments) — prevents dirty reads while allowing concurrent modifications
- **REPEATABLE_READ** for write operations (createTask, updateTask, deleteTask) and for getStats — ensures consistent reads across multiple queries within the same transaction. The stats method runs 5 separate queries that must see the same data snapshot.
- Justification: REPEATABLE_READ is needed for getStats because it runs countAllTasks, countCompletedTasks, findOverdueTasks, countByPriority, and countByCategory in sequence. Without it, a task completed between queries would cause inconsistent statistics.

## AI Usage
- **Tools used**: Claude Code (Anthropic) for code generation and debugging
- **Tasks AI assisted with**: Generating initial project structure, writing JPA entity mappings, creating React components, writing CSS styles, creating SQL schema and sample data, implementing report filter queries
- **Verification**: All AI-generated code was reviewed for correctness, tested locally with the running application, and modified as needed. Database queries were verified in MySQL Workbench. API endpoints were tested via the React frontend. Transaction isolation levels and index choices were validated against MySQL documentation.
