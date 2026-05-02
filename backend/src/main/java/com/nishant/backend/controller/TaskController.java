package com.nishant.backend.controller;

import com.nishant.backend.dto.TaskRequest;
import com.nishant.backend.dto.TaskStats;
import com.nishant.backend.model.Task;
import com.nishant.backend.model.TaskComment;
import com.nishant.backend.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ===== CRUD Operations (Requirement 1) =====

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    // ===== Filtering and Stats (Requirement 2) =====

    @GetMapping("/tasks/filter")
    public List<Task> filterTasks(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return taskService.filterTasks(categoryId, status, priority, startDate, endDate);
    }

    @GetMapping("/tasks/stats")
    public TaskStats getStats() {
        return taskService.getStats();
    }

    // ===== Comments (Supporting Table Operations) =====

    @GetMapping("/tasks/{id}/comments")
    public List<TaskComment> getComments(@PathVariable Long id) {
        return taskService.getComments(id);
    }

    @PostMapping("/tasks/{id}/comments")
    public TaskComment addComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return taskService.addComment(id, body.get("content"));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        taskService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
