package com.FoodOrderingSystem.payment_service.service;

import com.FoodOrderingSystem.payment_service.dto.CreatePaymentRequest;
import com.FoodOrderingSystem.payment_service.dto.PaymentResponse;
import com.FoodOrderingSystem.payment_service.entity.Payment;
import com.FoodOrderingSystem.payment_service.entity.PaymentMethod;
import com.FoodOrderingSystem.payment_service.entity.PaymentStatus;
import com.FoodOrderingSystem.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentResponse createPayment(CreatePaymentRequest request) {

        PaymentStatus status;

        if (request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            status = PaymentStatus.PENDING;
        } else if (request.getPaymentMethod() == PaymentMethod.VISA) {
            status = PaymentStatus.CONFIRMED;
        } else {
            status = PaymentStatus.FAILED;
        }

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(status)
                .amount(request.getAmount())
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponse(savedPayment);
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return mapToResponse(payment);
    }

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for this order"));

        return mapToResponse(payment);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PaymentResponse confirmPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.CONFIRMED);

        Payment updatedPayment = paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }

    public PaymentResponse failPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.FAILED);

        Payment updatedPayment = paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}