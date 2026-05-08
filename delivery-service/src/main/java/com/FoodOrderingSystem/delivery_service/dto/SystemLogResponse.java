package com.FoodOrderingSystem.delivery_service.dto;

import java.time.LocalDateTime;

public class SystemLogResponse {

    private Long id;
    private String serviceName;
    private String className;
    private String methodName;
    private String actionType;
    private String status;
    private String message;
    private Long executionTimeMs;
    private LocalDateTime createdAt;

    public SystemLogResponse(
            Long id,
            String serviceName,
            String className,
            String methodName,
            String actionType,
            String status,
            String message,
            Long executionTimeMs,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.serviceName = serviceName;
        this.className = className;
        this.methodName = methodName;
        this.actionType = actionType;
        this.status = status;
        this.message = message;
        this.executionTimeMs = executionTimeMs;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getClassName() {
        return className;
    }

    public String getMethodName() {
        return methodName;
    }

    public String getActionType() {
        return actionType;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}