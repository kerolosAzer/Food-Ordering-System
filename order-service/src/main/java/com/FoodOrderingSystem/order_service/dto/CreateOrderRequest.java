package com.FoodOrderingSystem.order_service.dto;

import com.FoodOrderingSystem.order_service.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Customer id is required")
    private Long customerId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    @NotNull(message = "Restaurant id is required")
    private Long restaurantId;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
}