package com.FoodOrderingSystem.payment_service.dto;

import com.FoodOrderingSystem.payment_service.entity.PaymentMethod;
import com.FoodOrderingSystem.payment_service.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Double amount;
    private LocalDateTime paymentDate;
}