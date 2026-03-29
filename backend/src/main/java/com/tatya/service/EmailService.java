package com.tatya.service;

import com.tatya.entity.Booking;
import com.tatya.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final ObjectProvider<JavaMailSender> javaMailSenderProvider;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${mail.log.credentials:false}")
    private boolean logCredentials;

    @Value("${mail.from:noreply@tatya.local}")
    private String from;

    private JavaMailSender requireMailSender() {
        JavaMailSender sender = javaMailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.error(
                    "JavaMailSender bean is missing. Add spring-boot-starter-mail and set spring.mail.host (and credentials).");
        }
        return sender;
    }

    private void sendSimple(String toEmail, String subject, String text) {
        if (!mailEnabled) {
            log.info("mail.enabled=false — skipping email to {}", toEmail);
            return;
        }
        JavaMailSender sender = requireMailSender();
        if (sender == null) {
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);
            sender.send(message);
            log.info("Mail sent OK to {}", toEmail);
        } catch (MailAuthenticationException e) {
            log.error(
                    "SMTP authentication failed for user {}. Check spring.mail.username / spring.mail.password. "
                            + "Gmail: use an App Password (16 chars) with NO spaces, 2FA on. Cause: {}",
                    from, e.getMessage());
            log.debug("Mail auth detail", e);
        } catch (MailException e) {
            log.error("Mail send failed to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    public void sendVendorApprovedCredentials(String toEmail, String fullName, String plainPassword,
            String setPasswordUrl) {
        log.info("Email trigger: vendor approval credentials. to={}", toEmail);
        if (logCredentials) {
            log.warn("DEBUG mail.log.credentials=true -> printing vendor password for {}: {}", toEmail, plainPassword);
        }
        if (!mailEnabled) {
            log.info("Mail disabled. Skipping vendor approval email to {}", toEmail);
            return;
        }
        String safeName = (fullName == null || fullName.isBlank()) ? "Vendor" : fullName.trim();
        String linkLine = (setPasswordUrl != null && !setPasswordUrl.isBlank())
                ? "Set your permanent 6-digit login password (use the temporary password below on that page):\n"
                        + setPasswordUrl + "\n\n"
                : "";
        String text = "Hello " + safeName + ",\n\n"
                + "Your vendor KYC has been approved.\n\n"
                + "Temporary password (from this email — enter it on the set-password page):\n"
                + plainPassword + "\n\n"
                + "Your login email: " + toEmail + "\n\n"
                + linkLine
                + "After you set your 6-digit password, sign in on the Tatya app with your email and the new password.\n\n"
                + "Thanks,\n"
                + "Tatya Team";
        log.info("Sending vendor approval email. from={} to={}", from, toEmail);
        sendSimple(toEmail, "Tatya Vendor Account Approved", text);
    }

    public void sendBookingConfirmationEmail(User customer, Booking booking, boolean cashOnDelivery) {
        sendBookingConfirmationEmail(customer, booking, cashOnDelivery, null);
    }

    public void sendBookingConfirmationEmail(User customer, Booking booking, boolean cashOnDelivery,
            String toEmailOverride) {
        if (customer == null || booking == null) {
            log.warn("Skipping booking confirmation email: missing customer or booking");
            return;
        }
        String toEmail = (toEmailOverride != null && !toEmailOverride.isBlank())
                ? toEmailOverride.trim()
                : (customer.getEmail() != null ? customer.getEmail().trim() : "");
        if (toEmail.isBlank()) {
            log.warn("Skipping booking confirmation email: no recipient for user id {}", customer.getId());
            return;
        }

        log.info("Email trigger: booking confirmation. to={} bookingId={} cod={}", toEmail, booking.getBookingId(),
                cashOnDelivery);

        if (!mailEnabled) {
            log.info("Mail disabled. Skipping booking confirmation email to {}", toEmail);
            return;
        }

        String name = (customer.getFullName() == null || customer.getFullName().isBlank())
                ? "Customer"
                : customer.getFullName().trim();
        BigDecimal total = booking.getTotalCost() != null ? booking.getTotalCost() : BigDecimal.ZERO;
        String paymentLine = cashOnDelivery
                ? "Payment: Cash on Delivery (COD) — pay when the service is completed."
                : "Payment: Received online via Razorpay. Your booking is paid.";

        String text = "Hello " + name + ",\n\n"
                + "Your booking is confirmed.\n\n"
                + "Booking ID: " + booking.getBookingId() + "\n"
                + "Service date: " + booking.getServiceDate() + "\n"
                + "Time: " + booking.getStartTime() + " - " + booking.getEndTime() + "\n"
                + "Total: ₹" + total + "\n"
                + paymentLine + "\n\n"
                + "Thank you for choosing Tatya.\n"
                + "Tatya Team";

        log.info("Sending booking confirmation. from={} to={}", from, toEmail);
        sendSimple(toEmail, "Tatya — Booking confirmed #" + booking.getBookingId(), text);
    }
}
