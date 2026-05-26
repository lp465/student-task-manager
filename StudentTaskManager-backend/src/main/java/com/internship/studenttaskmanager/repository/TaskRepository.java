package com.internship.studenttaskmanager.repository;

import com.internship.studenttaskmanager.model.Task;
import com.internship.studenttaskmanager.model.TaskStatus;
import com.internship.studenttaskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    Optional<Task> findByIdAndUserId(Long taskId, Long userId);
}