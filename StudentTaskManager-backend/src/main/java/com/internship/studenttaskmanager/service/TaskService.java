package com.internship.studenttaskmanager.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.internship.studenttaskmanager.dto.TaskRequestDTO;
import com.internship.studenttaskmanager.dto.TaskResponseDTO;
import com.internship.studenttaskmanager.dto.TaskSummaryDTO;
import com.internship.studenttaskmanager.exception.BadRequestException;
import com.internship.studenttaskmanager.exception.ResourceNotFoundException;
import com.internship.studenttaskmanager.model.Task;
import com.internship.studenttaskmanager.model.TaskPriority;
import com.internship.studenttaskmanager.model.TaskStatus;
import com.internship.studenttaskmanager.model.User;
import com.internship.studenttaskmanager.repository.TaskRepository;
import com.internship.studenttaskmanager.repository.UserRepository;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TaskResponseDTO convertToDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTaskTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                task.getSubject(),
                task.getUser().getId(),
                task.getUser().getName(),
                task.getUser().getEmail(),
                task.getPriority()
        );
    }

    private TaskStatus resolveStatus(TaskStatus incoming, TaskStatus fallback) {
        return incoming != null ? incoming : fallback;
    }

    public TaskResponseDTO createTask(Long userId, TaskRequestDTO dto) {
        User user = getUser(userId);
        Task task = new Task();
        task.setTaskTitle(dto.getTaskTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(resolveStatus(dto.getStatus(), TaskStatus.PENDING));
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(dto.getDueDate());
        task.setSubject(dto.getSubject());
        task.setUser(user);
        return convertToDTO(taskRepository.save(task));
    }

    public List<TaskResponseDTO> getTasksByUser(Long userId, TaskStatus status) {
        User user = getUser(userId);
        List<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByUserAndStatus(user, status);
        } else {
            tasks = taskRepository.findByUser(user);
        }
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO updateTask(Long taskId, Long userId, TaskRequestDTO dto) {
        // Check task exists and belongs to this user
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Task not found or does not belong to this user"));

        // Status transition validation
        if (task.getStatus() == TaskStatus.COMPLETED
                && dto.getStatus() == TaskStatus.PENDING) {
            throw new BadRequestException(
                    "Cannot revert a completed task back to pending");
        }

        task.setTaskTitle(dto.getTaskTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(resolveStatus(dto.getStatus(), task.getStatus()));
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : task.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setSubject(dto.getSubject());
        return convertToDTO(taskRepository.save(task));
    }

    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Task not found or does not belong to this user"));
        taskRepository.deleteById(task.getId());
    }

    public TaskSummaryDTO getTaskSummary(Long userId) {
        User user = getUser(userId);
        long completed = taskRepository.countByUserAndStatus(user, TaskStatus.COMPLETED);
        long pending = taskRepository.countByUserAndStatus(user, TaskStatus.PENDING);
        long highPriorityPending = taskRepository.countByUserAndStatusAndPriority(user, TaskStatus.PENDING, TaskPriority.HIGH);
        return new TaskSummaryDTO(completed + pending, completed, pending, highPriorityPending);
    }
}
