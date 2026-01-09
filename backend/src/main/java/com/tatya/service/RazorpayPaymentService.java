package com.tatya.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.tatya.entity.Booking;
import com.tatya.entity.Payment;
import com.tatya.repository.BookingRepository;
import com.tatya.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RazorpayPaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.secret:placeholder_secret}")
    private String apiSecret;

    @Transactional
    public Payment createOrder(Long bookingId, Double amount) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // amount in the smallest currency unit (paise)
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + bookingId);

        Order order = razorpayClient.orders.create(orderRequest);
        String razorpayOrderId = order.get("id");

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setPaymentMethod(Payment.PaymentMethod.UPI); // Default, can be updated later
        payment.setPaymentStatus(Payment.PaymentStatus.PENDING);
        payment.setRazorpayOrderId(razorpayOrderId);
        // DO NOT set transactionId here, it comes from Razorpay after success
        payment.setTimestamp(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(String razorpayOrderId, String razorpayPaymentId, String signature) throws Exception {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", signature);

        boolean isValid = Utils.verifyPaymentSignature(options, apiSecret);

        if (isValid) {
            payment.setPaymentStatus(Payment.PaymentStatus.PAID);
            payment.setTransactionId(razorpayPaymentId);
            payment.setRazorpaySignature(signature);

            // Update booking status
            Booking booking = payment.getBooking();
            booking.setStatus(Booking.BookingStatus.ACCEPTED);
            bookingRepository.save(booking);

            return paymentRepository.save(payment);
        } else {
            payment.setPaymentStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new RuntimeException("Payment verification failed");
        }
    }
}
