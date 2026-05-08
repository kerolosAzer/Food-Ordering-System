package com.FoodOrderingSystem.delivery_service.controller;

import com.FoodOrderingSystem.delivery_service.dto.AssignDeliveryRequest;
import com.FoodOrderingSystem.delivery_service.dto.DeliveryResponse;
import com.FoodOrderingSystem.delivery_service.dto.UpdateDeliveryStatusRequest;
import com.FoodOrderingSystem.delivery_service.entity.DeliveryStatus;
import com.FoodOrderingSystem.delivery_service.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/assign")
    public DeliveryResponse assignDelivery(@Valid @RequestBody AssignDeliveryRequest request) {
        return deliveryService.assignDelivery(request);
    }

    @GetMapping
    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public DeliveryResponse getDeliveryById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id);
    }

    @GetMapping("/order/{orderId}")
    public DeliveryResponse getDeliveryByOrderId(@PathVariable Long orderId) {
        return deliveryService.getDeliveryByOrderId(orderId);
    }

    @GetMapping("/user/{deliveryUserId}")
    public List<DeliveryResponse> getDeliveriesByDeliveryUserId(@PathVariable Long deliveryUserId) {
        return deliveryService.getDeliveriesByDeliveryUserId(deliveryUserId);
    }

    @GetMapping("/status/{status}")
    public List<DeliveryResponse> getDeliveriesByStatus(@PathVariable DeliveryStatus status) {
        return deliveryService.getDeliveriesByStatus(status);
    }

    @PutMapping("/{id}/status")
    public DeliveryResponse updateDeliveryStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDeliveryStatusRequest request
    ) {
        return deliveryService.updateDeliveryStatus(id, request.getDeliveryStatus());
    }
}