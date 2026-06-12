package com.internship.studenttaskmanager.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.internship.studenttaskmanager.dto.AnalyticsSummaryDTO;
import com.internship.studenttaskmanager.model.TaskPriority;
import com.internship.studenttaskmanager.model.TaskStatus;

@Service
public class AnalyticsService {

    private final TaskService taskService;
    private final com.internship.studenttaskmanager.repository.TaskRepository taskRepository;

    public AnalyticsService(TaskService taskService, com.internship.studenttaskmanager.repository.TaskRepository taskRepository) {
        this.taskService = taskService;
        this.taskRepository = taskRepository;
    }

    public AnalyticsSummaryDTO summaryForUser(String email) {
        com.internship.studenttaskmanager.model.User user = taskService.getUserByEmail(email);
        long completed = taskRepository.countByUserAndStatus(user, TaskStatus.COMPLETED);
        long pending = taskRepository.countByUserAndStatus(user, TaskStatus.PENDING);
        long total = completed + pending;
        double completionPct = total == 0 ? 0.0 : (completed * 100.0 / total);
        long highPending = taskRepository.countByUserAndStatusAndPriority(user, TaskStatus.PENDING, TaskPriority.HIGH);

        LocalDate today = LocalDate.now();
        long overdue = taskRepository.countByUserAndDueDateBeforeAndStatus(user, today, TaskStatus.PENDING);
        LocalDate weekEnd = today.plusDays(7);
        long dueThisWeek = taskRepository.countByUserAndDueDateBetweenAndStatus(user, today, weekEnd, TaskStatus.PENDING);

        Map<String, Long> categoryDist = new HashMap<>();
        List<Object[]> cat = taskRepository.countByCategory(user);
        for (Object[] row : cat) {
            String s = (String) row[0];
            Long c = ((Number) row[1]).longValue();
            categoryDist.put(s, c);
        }

        Map<String, Long> priorityDist = new HashMap<>();
        List<Object[]> pr = taskRepository.countByPriority(user);
        for (Object[] row : pr) {
            String p = String.valueOf(row[0]);
            Long c = ((Number) row[1]).longValue();
            priorityDist.put(p, c);
        }

        return new AnalyticsSummaryDTO(total, completed, pending, completionPct, highPending, overdue, dueThisWeek, categoryDist, priorityDist);
    }
}
