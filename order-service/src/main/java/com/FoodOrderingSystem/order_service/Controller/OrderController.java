package com.FoodOrderingSystem.order_service.controller;

import com.FoodOrderingSystem.order_service.dto.CreateOrderRequest;
import com.FoodOrderingSystem.order_service.dto.OrderResponse;
import com.FoodOrderingSystem.order_service.dto.UpdateOrderStatusRequest;
import com.FoodOrderingSystem.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import com.FoodOrderingSystem.order_service.dto.UpdatePaymentStatusRequest;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
     public OrderResponse createOrder(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody CreateOrderRequest request
        ) {
    return orderService.createOrder(request, authorizationHeader);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderResponse> getOrdersByCustomerId(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomerId(customerId);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateOrderStatus(id, request.getStatus());
    }
    @PutMapping("/{id}/cancel")
    public OrderResponse cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }
    @PutMapping("/{id}/payment-status")
    public OrderResponse updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        return orderService.updatePaymentStatus(id, request.getPaymentStatus());
    }
    @GetMapping("/restaurant/{restaurantId}")
    public List<OrderResponse> getOrdersByRestaurantId(@PathVariable Long restaurantId) {
        return orderService.getOrdersByRestaurantId(restaurantId);
    }
}