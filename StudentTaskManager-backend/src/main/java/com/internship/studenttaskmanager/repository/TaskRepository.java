package com.internship.studenttaskmanager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.internship.studenttaskmanager.model.Task;
import com.internship.studenttaskmanager.model.TaskPriority;
import com.internship.studenttaskmanager.model.TaskStatus;
import com.internship.studenttaskmanager.model.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t JOIN FETCH t.user WHERE t.user = :user")
    List<Task> findByUser(@Param("user") User user);

    @Query("SELECT t FROM Task t JOIN FETCH t.user WHERE t.user = :user AND t.status = :status")
    List<Task> findByUserAndStatus(@Param("user") User user, @Param("status") TaskStatus status);

    Optional<Task> findByIdAndUserId(Long taskId, Long userId);

    long countByUserAndStatus(User user, TaskStatus status);

    long countByUserAndPriority(User user, TaskPriority priority);

    long countByUserAndStatusAndPriority(User user, TaskStatus status, TaskPriority priority);

    long countByUserAndDueDateBeforeAndStatus(User user, java.time.LocalDate date, TaskStatus status);

    long countByUserAndDueDateBetweenAndStatus(User user, java.time.LocalDate start, java.time.LocalDate end, TaskStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT t.subject, COUNT(t) FROM Task t WHERE t.user = :user GROUP BY t.subject")
    java.util.List<Object[]> countBySubject(@org.springframework.data.repository.query.Param("user") User user);

    @org.springframework.data.jpa.repository.Query("SELECT t.priority, COUNT(t) FROM Task t WHERE t.user = :user GROUP BY t.priority")
    java.util.List<Object[]> countByPriority(@org.springframework.data.repository.query.Param("user") User user);
}
