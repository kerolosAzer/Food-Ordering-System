package com.FoodOrderingSystem.delivery_service.repository;

import com.FoodOrderingSystem.delivery_service.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    List<SystemLog> findTop100ByOrderByCreatedAtDesc();

    List<SystemLog> findByStatusOrderByCreatedAtDesc(String status);

    List<SystemLog> findByActionTypeOrderByCreatedAtDesc(String actionType);
}