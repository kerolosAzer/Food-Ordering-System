package com.FoodOrderingSystem.delivery_service.controller;

import com.FoodOrderingSystem.delivery_service.dto.SystemLogResponse;
import com.FoodOrderingSystem.delivery_service.service.SystemLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class SystemLogController {

    private final SystemLogService systemLogService;

    public SystemLogController(SystemLogService systemLogService) {
        this.systemLogService = systemLogService;
    }

    @GetMapping
    public List<SystemLogResponse> getLatestLogs() {
        return systemLogService.getLatestLogs();
    }

    @GetMapping("/status/{status}")
    public List<SystemLogResponse> getLogsByStatus(@PathVariable String status) {
        return systemLogService.getLogsByStatus(status);
    }

    @GetMapping("/action/{actionType}")
    public List<SystemLogResponse> getLogsByActionType(@PathVariable String actionType) {
        return systemLogService.getLogsByActionType(actionType);
    }
}