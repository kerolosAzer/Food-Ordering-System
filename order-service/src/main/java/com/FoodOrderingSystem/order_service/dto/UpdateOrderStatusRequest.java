package com.FoodOrderingSystem.order_service.dto;

import com.FoodOrderingSystem.order_service.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;
}