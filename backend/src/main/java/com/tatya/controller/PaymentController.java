package com.tatya.controller;

import com.tatya.entity.Payment;
import com.tatya.service.RazorpayPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayPaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Long bookingId = Long.parseLong(data.get("bookingId").toString());
            Double amount = Double.parseDouble(data.get("amount").toString());
            Payment payment = paymentService.createOrder(bookingId, amount);
            return ResponseEntity.ok(Map.of(
                    "orderId", payment.getRazorpayOrderId(),
                    "amount", payment.getAmount()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("razorpay_order_id");
            String paymentId = data.get("razorpay_payment_id");
            String signature = data.get("razorpay_signature");

            Payment payment = paymentService.verifyPayment(orderId, paymentId, signature);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
