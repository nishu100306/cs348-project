package com.nishant.backend.service;

import com.nishant.backend.dto.TaskRequest;
import com.nishant.backend.dto.TaskStats;
import com.nishant.backend.model.*;
import com.nishant.backend.model.Task.Priority;
import com.nishant.backend.model.Task.Status;
import com.nishant.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final TaskCommentRepository commentRepository;

    public TaskService(TaskRepository taskRepository,
                       CategoryRepository categoryRepository,
                       TagRepository tagRepository,
                       TaskCommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
    }

    // READ_COMMITTED: sufficient for reading the task list — we only need to see committed data,
    // no need for repeatable reads since this is a single SELECT.
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // REPEATABLE_READ: creating a task involves reading from categories and tags tables,
    // then writing to tasks and task_tags. We need to ensure the category/tag data we read
    // doesn't change mid-transaction (e.g., a category being deleted while we assign it).
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Task createTask(TaskRequest request) {
        // Input validation to protect against malicious data (SQL injection defense-in-depth)
        validateTaskRequest(request);
        Task task = new Task();
        mapRequestToTask(request, task);
        return taskRepository.save(task);
    }

    // REPEATABLE_READ: updating a task reads the existing task, then reads categories/tags,
    // then writes updates to tasks and task_tags. Multiple tables are touched, so we need
    // consistent reads to avoid phantom data if another user modifies the same task.
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Task updateTask(Long id, TaskRequest request) {
        validateTaskRequest(request);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        // Track completion timestamp
        if (request.getStatus() != null
                && request.getStatus().equals("COMPLETED")
                && task.getStatus() != Status.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        }

        mapRequestToTask(request, task);
        return taskRepository.save(task);
    }

    // REPEATABLE_READ: deleting a task cascades to task_tags and task_comments.
    // We need consistent reads to ensure the task still exists and all related
    // records are deleted atomically.
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // ===== Input Validation (SQL Injection Defense-in-Depth) =====
    // Even though Spring Data JPA uses parameterized queries (prepared statements) which
    // prevent SQL injection at the database level, we add input validation as a second
    // layer of defense. This ensures malicious input is rejected before it ever reaches
    // the database layer.
    private void validateTaskRequest(TaskRequest request) {
        if (request.getTitle() != null) {
            if (request.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Task title cannot be empty");
            }
            if (request.getTitle().length() > 255) {
                throw new IllegalArgumentException("Task title cannot exceed 255 characters");
            }
        }
        if (request.getDescription() != null && request.getDescription().length() > 5000) {
            throw new IllegalArgumentException("Description cannot exceed 5000 characters");
        }
        // Validate priority is a valid enum value (prevents invalid input)
        if (request.getPriority() != null) {
            try {
                Priority.valueOf(request.getPriority());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid priority: " + request.getPriority());
            }
        }
        // Validate status is a valid enum value
        if (request.getStatus() != null) {
            try {
                Status.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + request.getStatus());
            }
        }
        // Validate tag names
        if (request.getTagNames() != null) {
            for (String tagName : request.getTagNames()) {
                if (tagName == null || tagName.trim().isEmpty()) {
                    throw new IllegalArgumentException("Tag name cannot be empty");
                }
                if (tagName.length() > 50) {
                    throw new IllegalArgumentException("Tag name cannot exceed 50 characters");
                }
            }
        }
    }

    private void mapRequestToTask(TaskRequest request, Task task) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getPriority() != null) {
            task.setPriority(Priority.valueOf(request.getPriority()));
        }
        if (request.getStatus() != null) {
            task.setStatus(Status.valueOf(request.getStatus()));
        }

        task.setDueDate(request.getDueDate());

        // Set category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            task.setCategory(category);
        } else {
            task.setCategory(null);
        }

        // Set tags — findByName uses a parameterized query (@Param), preventing SQL injection
        if (request.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTagNames()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                tags.add(tag);
            }
            task.setTags(tags);
        }
    }

    // READ_COMMITTED: the filter query is a single SELECT with parameterized inputs.
    // READ_COMMITTED prevents dirty reads while allowing other transactions to insert/update
    // concurrently, which is the right balance for a read-only report.
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<Task> filterTasks(Long categoryId, String status, String priority,
                                  LocalDate startDate, LocalDate endDate) {
        Status statusEnum = (status != null && !status.isEmpty()) ? Status.valueOf(status) : null;
        Priority priorityEnum = (priority != null && !priority.isEmpty()) ? Priority.valueOf(priority) : null;
        return taskRepository.findByFilters(categoryId, statusEnum, priorityEnum, startDate, endDate);
    }

    // REPEATABLE_READ: the stats method runs multiple SELECT queries (countAll, countCompleted,
    // findOverdue, countByPriority, countByCategory). We need REPEATABLE_READ to ensure all
    // these queries see the same snapshot of data — otherwise a task could be completed between
    // the countAll and countCompleted queries, leading to inconsistent statistics.
    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public TaskStats getStats() {
        TaskStats stats = new TaskStats();

        Long total = taskRepository.countAllTasks();
        Long completed = taskRepository.countCompletedTasks();
        Long overdue = (long) taskRepository.findOverdueTasks(LocalDate.now()).size();

        stats.setTotalTasks(total);
        stats.setCompletedTasks(completed);
        stats.setCompletionRate(total > 0 ? Math.round((completed * 100.0 / total) * 10.0) / 10.0 : 0.0);
        stats.setOverdueCount(overdue);

        // Tasks by priority
        Map<String, Long> byPriority = new LinkedHashMap<>();
        for (Object[] row : taskRepository.countByPriority()) {
            byPriority.put(row[0].toString(), (Long) row[1]);
        }
        stats.setTasksByPriority(byPriority);

        // Tasks by category
        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (Object[] row : taskRepository.countByCategory()) {
            byCategory.put((String) row[0], (Long) row[1]);
        }
        stats.setTasksByCategory(byCategory);

        return stats;
    }

    // Comments
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<TaskComment> getComments(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }

    // REPEATABLE_READ: adding a comment reads the task (to verify it exists) then inserts
    // into task_comments. We need the task to remain consistent during this operation.
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public TaskComment addComment(Long taskId, String content) {
        // Input validation
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (content.length() > 5000) {
            throw new IllegalArgumentException("Comment cannot exceed 5000 characters");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
