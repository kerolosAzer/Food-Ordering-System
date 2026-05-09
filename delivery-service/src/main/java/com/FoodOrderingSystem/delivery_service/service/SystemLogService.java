package com.FoodOrderingSystem.delivery_service.service;

import com.FoodOrderingSystem.delivery_service.dto.SystemLogResponse;
import com.FoodOrderingSystem.delivery_service.entity.SystemLog;
import com.FoodOrderingSystem.delivery_service.repository.SystemLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    public SystemLogService(SystemLogRepository systemLogRepository) {
        this.systemLogRepository = systemLogRepository;
    }

    public void saveLog(
            String serviceName,
            String className,
            String methodName,
            String actionType,
            String status,
            String message,
            Long executionTimeMs
    ) {
        SystemLog log = new SystemLog();

        log.setServiceName(serviceName);
        log.setClassName(className);
        log.setMethodName(methodName);
        log.setActionType(actionType);
        log.setStatus(status);
        log.setMessage(message);
        log.setExecutionTimeMs(executionTimeMs);

        systemLogRepository.save(log);
    }

    public List<SystemLogResponse> getLatestLogs() {
        return systemLogRepository.findTop100ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SystemLogResponse> getLogsByStatus(String status) {
        return systemLogRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SystemLogResponse> getLogsByActionType(String actionType) {
        return systemLogRepository.findByActionTypeOrderByCreatedAtDesc(actionType)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SystemLogResponse mapToResponse(SystemLog log) {
        return new SystemLogResponse(
                log.getId(),
                log.getServiceName(),
                log.getClassName(),
                log.getMethodName(),
                log.getActionType(),
                log.getStatus(),
                log.getMessage(),
                log.getExecutionTimeMs(),
                log.getCreatedAt()
        );
    }
}