package com.FoodOrderingSystem.delivery_service.dto;

import com.FoodOrderingSystem.delivery_service.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDeliveryStatusRequest {

    @NotNull(message = "Delivery status is required")
    private DeliveryStatus deliveryStatus;
}
