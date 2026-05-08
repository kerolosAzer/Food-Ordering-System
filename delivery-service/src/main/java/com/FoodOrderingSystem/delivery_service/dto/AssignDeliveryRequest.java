package com.FoodOrderingSystem.delivery_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignDeliveryRequest {

    @NotNull(message = "Order id is required")
    private Long orderId;

    @NotNull(message = "Delivery user id is required")
    private Long deliveryUserId;

    private String deliveryUserName;
}