# SMS Troubleshooting Guide

## Problem: SMS Not Received

If SMS is not being received, follow these steps:

### Step 1: Check SMS Configuration Status

Call the status endpoint to see current configuration:
```bash
GET http://localhost:8080/api/sms/status
```

### Step 2: Check Application Logs

When you request an OTP, check the console/logs for:
- Error messages about missing credentials
- OTP codes (if SMS is not configured, OTP will be logged)
- SMS sending status

### Step 3: Verify Configuration

#### For Twilio:
1. Check `application.properties` has:
```properties
sms.provider=twilio
sms.enabled=true
twilio.account.sid=your_account_sid_here
twilio.auth.token=your_auth_token_here
twilio.phone.number=+1234567890
```

2. Get credentials from: https://www.twilio.com/console
3. For trial accounts, verify the recipient phone number in Twilio console

#### For MSG91:
1. Check `application.properties` has:
```properties
sms.provider=msg91
sms.enabled=true
msg91.auth.key=your_auth_key_here
```

2. Get credentials from: https://msg91.com/
3. Update template_id in `Msg91SmsService.java`

### Step 4: Test SMS Sending

Test SMS with:
```bash
POST http://localhost:8080/api/sms/test?phoneNumber=1234567890
```

### Step 5: Common Issues

#### Issue: "Twilio credentials not configured"
**Solution:** Add Twilio credentials to `application.properties` and restart the application.

#### Issue: "Invalid phone number format"
**Solution:** Ensure phone number is 10 digits (for India). The system will add +91 automatically.

#### Issue: "Twilio trial account restrictions"
**Solution:** 
- Verify recipient phone number in Twilio console
- Upgrade to paid account for production use
- Check Twilio console for delivery status

#### Issue: "SMS sent but not received"
**Possible causes:**
1. Phone number blocked or invalid
2. SMS provider rate limits
3. Network issues
4. Spam filters blocking SMS

**Check:**
- Twilio console → Logs → Messaging logs
- MSG91 dashboard → Reports
- Application logs for error messages

### Step 6: Development Mode (No SMS Provider)

If you don't have SMS credentials, the system will log OTP codes:

```
========================================
SMS PROVIDER: LOGGING MODE (SMS not configured)
Phone Number: +911234567890
OTP Code: 1234
========================================
```

Check your application console/logs to see the OTP code.

### Step 7: Enable Logging Mode

To explicitly use logging mode (for development):
```properties
sms.provider=none
```

## Quick Setup for Testing

### Option 1: Use Twilio Trial Account (Free)

1. Sign up at https://www.twilio.com/try-twilio
2. Get Account SID and Auth Token from console
3. Get a trial phone number
4. Verify your phone number in Twilio console
5. Add to `application.properties`:
```properties
sms.provider=twilio
twilio.account.sid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token=your_auth_token
twilio.phone.number=+15017122661  # Your Twilio number
```

### Option 2: Use MSG91 (India)

1. Sign up at https://msg91.com/
2. Get Auth Key from dashboard
3. Create OTP template
4. Add to `application.properties`:
```properties
sms.provider=msg91
msg91.auth.key=your_auth_key
```

### Option 3: Development (Logging Only)

```properties
sms.provider=none
```

Check console logs for OTP codes.

## Verification Checklist

- [ ] SMS provider configured in `application.properties`
- [ ] Credentials are correct and not empty
- [ ] Application restarted after configuration changes
- [ ] Phone number format is correct (10 digits for India)
- [ ] Checked application logs for errors
- [ ] Tested with `/api/sms/test` endpoint
- [ ] Verified SMS provider dashboard (Twilio/MSG91)

## Still Not Working?

1. Check application logs for detailed error messages
2. Verify SMS provider account is active
3. Check SMS provider dashboard for delivery status
4. Ensure phone number is not blocked
5. Try with a different phone number
6. Check network/firewall settings

