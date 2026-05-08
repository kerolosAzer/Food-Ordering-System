package com.FoodOrderingSystem.payment_service.controller;

import com.FoodOrderingSystem.payment_service.dto.CreatePaymentRequest;
import com.FoodOrderingSystem.payment_service.dto.PaymentResponse;
import com.FoodOrderingSystem.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        return paymentService.createPayment(request);
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentResponse getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }

    @PutMapping("/{id}/confirm")
    public PaymentResponse confirmPayment(@PathVariable Long id) {
        return paymentService.confirmPayment(id);
    }

    @PutMapping("/{id}/fail")
    public PaymentResponse failPayment(@PathVariable Long id) {
        return paymentService.failPayment(id);
    }
}