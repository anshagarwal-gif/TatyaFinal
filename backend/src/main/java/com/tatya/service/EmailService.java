package com.tatya.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final ApplicationContext applicationContext;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${mail.log.credentials:false}")
    private boolean logCredentials;

    @Value("${mail.from:noreply@tatya.local}")
    private String from;

    /**
     * Sends vendor credentials email.
     *
     * This method is intentionally implemented using reflection so the application
     * can still start even if the mail classes are not present on the runtime classpath.
     * (For example, when the server was started before adding the mail dependency.)
     */
    public void sendVendorApprovedCredentials(String toEmail, String fullName, String plainPassword) {
        log.info("Email trigger: vendor approval credentials. to={}", toEmail);
        if (logCredentials) {
            log.warn("DEBUG mail.log.credentials=true -> printing vendor password for {}: {}", toEmail, plainPassword);
        }

        if (!mailEnabled) {
            log.info("Mail disabled. Skipping vendor approval email to {}", toEmail);
            return;
        }

        try {
            log.info("Sending vendor approval email. from={} to={}", from, toEmail);

            Class<?> mailSenderClass = Class.forName("org.springframework.mail.javamail.JavaMailSender");
            Object mailSender = applicationContext.getBean(mailSenderClass);

            Class<?> messageClass = Class.forName("org.springframework.mail.SimpleMailMessage");
            Object message = messageClass.getDeclaredConstructor().newInstance();

            String safeName = (fullName == null || fullName.isBlank()) ? "Vendor" : fullName.trim();
            String text =
                    "Hello " + safeName + ",\n\n" +
                    "Your vendor KYC has been approved.\n\n" +
                    "Login credentials:\n" +
                    "Email: " + toEmail + "\n" +
                    "Password: " + plainPassword + "\n\n" +
                    "For security, please change your password after login.\n\n" +
                    "Thanks,\n" +
                    "Tatya Team";

            invoke(message, "setFrom", new Class<?>[]{String.class}, new Object[]{from});
            invoke(message, "setTo", new Class<?>[]{String.class}, new Object[]{toEmail});
            invoke(message, "setSubject", new Class<?>[]{String.class}, new Object[]{"Tatya Vendor Account Approved"});
            invoke(message, "setText", new Class<?>[]{String.class}, new Object[]{text});

            Method sendMethod = mailSenderClass.getMethod("send", messageClass);
            sendMethod.invoke(mailSender, message);

            log.info("Sent vendor approval email to {}", toEmail);
        } catch (ClassNotFoundException e) {
            log.warn("Mail classes not found on classpath. Skipping email to {}. Error: {}", toEmail, e.getMessage());
        } catch (org.springframework.beans.factory.NoSuchBeanDefinitionException e) {
            log.error("JavaMailSender bean not found. Make sure spring-boot-starter-mail is in dependencies and Spring Boot auto-configuration is enabled. Error: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Failed to send vendor approval email to {}. Error type: {}, Message: {}", toEmail, e.getClass().getSimpleName(), e.getMessage(), e);
            // Print full stack trace for debugging
            e.printStackTrace();
        }
    }

    private static void invoke(Object target, String methodName, Class<?>[] paramTypes, Object[] args) throws Exception {
        Method m = target.getClass().getMethod(methodName, paramTypes);
        m.invoke(target, args);
    }
}

