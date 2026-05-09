package com.FoodOrderingSystem.delivery_service.service;

import com.FoodOrderingSystem.delivery_service.dto.AssignDeliveryRequest;
import com.FoodOrderingSystem.delivery_service.dto.DeliveryResponse;
import com.FoodOrderingSystem.delivery_service.entity.Delivery;
import com.FoodOrderingSystem.delivery_service.entity.DeliveryStatus;
import com.FoodOrderingSystem.delivery_service.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryResponse assignDelivery(AssignDeliveryRequest request) {

        deliveryRepository.findByOrderId(request.getOrderId())
                .ifPresent(existingDelivery -> {
                    throw new RuntimeException("This order is already assigned to a delivery user");
                });

        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .deliveryUserId(request.getDeliveryUserId())
                .deliveryUserName(request.getDeliveryUserName())
                .deliveryStatus(DeliveryStatus.ASSIGNED)
                .build();

        Delivery savedDelivery = deliveryRepository.save(delivery);

        return mapToResponse(savedDelivery);
    }

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DeliveryResponse getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        return mapToResponse(delivery);
    }

    public DeliveryResponse getDeliveryByOrderId(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found for this order"));

        return mapToResponse(delivery);
    }

    public List<DeliveryResponse> getDeliveriesByDeliveryUserId(Long deliveryUserId) {
        return deliveryRepository.findByDeliveryUserId(deliveryUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<DeliveryResponse> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByDeliveryStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DeliveryResponse updateDeliveryStatus(Long id, DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        DeliveryStatus currentStatus = delivery.getDeliveryStatus();

        if (currentStatus == DeliveryStatus.DELIVERED) {
            throw new RuntimeException("Delivered order cannot be updated");
        }

        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new RuntimeException(
                    "Invalid delivery status transition from " + currentStatus + " to " + newStatus
            );
        }

        delivery.setDeliveryStatus(newStatus);

        Delivery updatedDelivery = deliveryRepository.save(delivery);

        return mapToResponse(updatedDelivery);
    }

    private boolean isValidStatusTransition(DeliveryStatus currentStatus, DeliveryStatus newStatus) {

        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {
            case ASSIGNED -> newStatus == DeliveryStatus.PICKED_UP
                    || newStatus == DeliveryStatus.OUT_FOR_DELIVERY
                    || newStatus == DeliveryStatus.FAILED;

            case PICKED_UP -> newStatus == DeliveryStatus.OUT_FOR_DELIVERY
                    || newStatus == DeliveryStatus.FAILED;

            case OUT_FOR_DELIVERY -> newStatus == DeliveryStatus.DELIVERED
                    || newStatus == DeliveryStatus.FAILED;

            case DELIVERED, FAILED -> false;
        };
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrderId())
                .deliveryUserId(delivery.getDeliveryUserId())
                .deliveryUserName(delivery.getDeliveryUserName())
                .deliveryStatus(delivery.getDeliveryStatus())
                .assignedAt(delivery.getAssignedAt())
                .updatedAt(delivery.getUpdatedAt())
                .build();
    }
}