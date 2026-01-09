package com.tatya.controller;

import com.tatya.entity.Payment;
import com.tatya.service.RazorpayPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayPaymentService paymentService;

    @Value("${razorpay.key.id:rzp_test_placeholder}")
    private String razorpayKeyId;

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

    @GetMapping("/key")
    public ResponseEntity<?> getRazorpayKey() {
        try {
            if (razorpayKeyId == null || razorpayKeyId.equals("rzp_test_placeholder") || razorpayKeyId.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Razorpay key not configured",
                        "message", "Please configure razorpay.key.id in application.properties"));
            }
            return ResponseEntity.ok(Map.of("keyId", razorpayKeyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
