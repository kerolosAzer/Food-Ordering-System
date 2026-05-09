package com.FoodOrderingSystem.delivery_service.dto;

import com.FoodOrderingSystem.delivery_service.entity.DeliveryStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DeliveryResponse {

    private Long id;

    private Long orderId;

    private Long deliveryUserId;

    private String deliveryUserName;

    private DeliveryStatus deliveryStatus;

    private LocalDateTime assignedAt;

    private LocalDateTime updatedAt;
}