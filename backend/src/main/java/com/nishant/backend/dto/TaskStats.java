package com.nishant.backend.dto;

import java.util.Map;

public class TaskStats {
    private Long totalTasks;
    private Long completedTasks;
    private Double completionRate;
    private Long overdueCount;
    private Map<String, Long> tasksByPriority;
    private Map<String, Long> tasksByCategory;

    public Long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }

    public Long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Long completedTasks) { this.completedTasks = completedTasks; }

    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }

    public Long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(Long overdueCount) { this.overdueCount = overdueCount; }

    public Map<String, Long> getTasksByPriority() { return tasksByPriority; }
    public void setTasksByPriority(Map<String, Long> tasksByPriority) { this.tasksByPriority = tasksByPriority; }

    public Map<String, Long> getTasksByCategory() { return tasksByCategory; }
    public void setTasksByCategory(Map<String, Long> tasksByCategory) { this.tasksByCategory = tasksByCategory; }
}
