package com.internship.studenttaskmanager.controller;

import com.internship.studenttaskmanager.dto.ApiResponse;
import com.internship.studenttaskmanager.dto.TaskRequestDTO;
import com.internship.studenttaskmanager.dto.TaskResponseDTO;
import com.internship.studenttaskmanager.dto.TaskSummaryDTO;
import com.internship.studenttaskmanager.model.TaskStatus;
import com.internship.studenttaskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(
            @Valid @RequestBody TaskRequestDTO dto,
            org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        TaskResponseDTO task = taskService.createTask(user.getId(), dto);
        return ResponseEntity.ok(
                ApiResponse.success("Task created successfully", task));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByUser(
            @RequestParam(required = false) TaskStatus status,
            org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        List<TaskResponseDTO> tasks = taskService.getTasksByUser(user.getId(), status);
        return ResponseEntity.ok(
                ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<TaskSummaryDTO>> getTaskSummary(
            org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        TaskSummaryDTO summary = taskService.getTaskSummary(user.getId());
        return ResponseEntity.ok(
                ApiResponse.success("Task summary retrieved successfully", summary));
    }

    @PutMapping("/update/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequestDTO dto,
            org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        TaskResponseDTO task = taskService.updateTask(taskId, user.getId(), dto);
        return ResponseEntity.ok(
                ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<ApiResponse<String>> deleteTask(
            @PathVariable Long taskId,
            org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        taskService.deleteTask(taskId, user.getId());
        return ResponseEntity.ok(
                ApiResponse.success("Task deleted successfully", null));
    }
}
