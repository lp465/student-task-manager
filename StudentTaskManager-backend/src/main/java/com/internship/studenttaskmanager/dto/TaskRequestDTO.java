package com.internship.studenttaskmanager.dto;

import com.internship.studenttaskmanager.model.TaskPriority;
import com.internship.studenttaskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequestDTO {

    @NotBlank(message = "Task title is required")
    private String taskTitle;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String subject;
}