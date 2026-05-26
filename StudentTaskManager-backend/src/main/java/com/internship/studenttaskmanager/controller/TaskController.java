package com.internship.studenttaskmanager.controller;

import com.internship.studenttaskmanager.dto.ApiResponse;
import com.internship.studenttaskmanager.dto.TaskRequestDTO;
import com.internship.studenttaskmanager.dto.TaskResponseDTO;
import com.internship.studenttaskmanager.model.TaskStatus;
import com.internship.studenttaskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(
            @PathVariable Long userId,
            @Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO task = taskService.createTask(userId, dto);
        return ResponseEntity.ok(
                ApiResponse.success("Task created successfully", task));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) TaskStatus status) {
        List<TaskResponseDTO> tasks = taskService.getTasksByUser(userId, status);
        return ResponseEntity.ok(
                ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @PutMapping("/update/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(
            @PathVariable Long taskId,
            @RequestParam Long userId,
            @Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO task = taskService.updateTask(taskId, userId, dto);
        return ResponseEntity.ok(
                ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<ApiResponse<String>> deleteTask(
            @PathVariable Long taskId,
            @RequestParam Long userId) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok(
                ApiResponse.success("Task deleted successfully", null));
    }
}