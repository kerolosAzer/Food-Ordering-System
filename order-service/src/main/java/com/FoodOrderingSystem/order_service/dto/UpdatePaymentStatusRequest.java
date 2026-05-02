package com.FoodOrderingSystem.order_service.dto;

import com.FoodOrderingSystem.order_service.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;
}