package com.nishant.backend.repository;

import com.nishant.backend.model.Task;
import com.nishant.backend.model.Task.Priority;
import com.nishant.backend.model.Task.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Complex filter query for Requirement 2
    @Query("SELECT t FROM Task t WHERE " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:startDate IS NULL OR t.dueDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.dueDate <= :endDate)")
    List<Task> findByFilters(
        @Param("categoryId") Long categoryId,
        @Param("status") Status status,
        @Param("priority") Priority priority,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Statistics queries
    @Query("SELECT COUNT(t) FROM Task t")
    Long countAllTasks();

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'COMPLETED'")
    Long countCompletedTasks();

    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT t.priority, COUNT(t) FROM Task t GROUP BY t.priority")
    List<Object[]> countByPriority();

    @Query("SELECT t.category.name, COUNT(t) FROM Task t WHERE t.category IS NOT NULL GROUP BY t.category.name")
    List<Object[]> countByCategory();
}
