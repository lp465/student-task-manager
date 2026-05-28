package com.internship.studenttaskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummaryDTO {
    private long totalCount;
    private long completedCount;
    private long pendingCount;
    private long highPriorityCount;
}
