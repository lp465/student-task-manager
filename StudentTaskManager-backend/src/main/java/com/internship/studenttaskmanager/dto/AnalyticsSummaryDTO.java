package com.internship.studenttaskmanager.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryDTO {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionPercentage;
    private long highPriorityPending;
    private long overdueTasks;
    private long dueThisWeek;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> priorityDistribution;
}
