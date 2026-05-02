package com.FoodOrderingSystem.order_service.dto;

import com.FoodOrderingSystem.order_service.entity.OrderStatus;
import com.FoodOrderingSystem.order_service.entity.PaymentMethod;
import com.FoodOrderingSystem.order_service.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private Long customerId;

    private Long restaurantId;

    private LocalDateTime orderDate;

    private OrderStatus orderStatus;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private Double totalPrice;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<OrderItemResponse> items;
}