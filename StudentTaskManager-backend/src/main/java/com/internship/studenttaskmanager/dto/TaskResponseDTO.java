package com.internship.studenttaskmanager.dto;

import com.internship.studenttaskmanager.model.TaskPriority;
import com.internship.studenttaskmanager.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {

    private Long id;
    private String taskTitle;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private String subject;
    private Long userId;
    private String userName;
    private String userEmail;
    private TaskPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
