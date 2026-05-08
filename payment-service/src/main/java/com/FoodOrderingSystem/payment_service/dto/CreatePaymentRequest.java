package com.FoodOrderingSystem.payment_service.dto;

import com.FoodOrderingSystem.payment_service.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePaymentRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private Double amount;
}