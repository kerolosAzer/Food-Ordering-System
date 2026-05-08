package com.FoodOrderingSystem.delivery_service.repository;

import com.FoodOrderingSystem.delivery_service.entity.Delivery;
import com.FoodOrderingSystem.delivery_service.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByDeliveryUserId(Long deliveryUserId);

    List<Delivery> findByDeliveryStatus(DeliveryStatus deliveryStatus);
}