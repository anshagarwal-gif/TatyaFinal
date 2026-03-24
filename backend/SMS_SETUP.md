# SMS Configuration Guide

The application supports multiple SMS providers for sending OTP codes. Configure your preferred provider in `application.properties`.

## Supported Providers

### 1. Twilio (Default)
Popular global SMS provider with good international support.

**Setup:**
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Update `application.properties`:

```properties
sms.provider=twilio
twilio.account.sid=your_account_sid
twilio.auth.token=your_auth_token
twilio.phone.number=+1234567890  # Your Twilio phone number
```

### 2. MSG91 (Popular in India)
Indian SMS provider with good rates for Indian numbers.

**Setup:**
1. Sign up at [MSG91](https://msg91.com/)
2. Get your Auth Key from MSG91 dashboard
3. Create an OTP template in MSG91
4. Update `application.properties`:

```properties
sms.provider=msg91
msg91.auth.key=your_auth_key
msg91.sender.id=TATYA
msg91.route=4
```

**Note:** Update `template_id` in `Msg91SmsService.java` with your MSG91 template ID.

### 3. Logging Only (Development)
For development/testing without actual SMS sending:

```properties
sms.provider=none
```

OTP codes will be logged to the console instead of being sent via SMS.

## Configuration Properties

```properties
# Enable/disable SMS sending
sms.enabled=true

# Choose provider: 'twilio', 'msg91', or 'none'
sms.provider=twilio

# Twilio Configuration
twilio.account.sid=
twilio.auth.token=
twilio.phone.number=

# MSG91 Configuration
msg91.auth.key=
msg91.sender.id=TATYA
msg91.route=4
msg91.country.code=91
```

## Testing Without SMS Provider

If you don't configure any SMS provider, the application will:
- Still generate and store OTPs in the database
- Log OTP codes to the console for testing
- Allow OTP verification to work normally

Check the application logs to see the OTP codes during development.

## Production Recommendations

1. **Use a real SMS provider** - Don't rely on logging in production
2. **Set up proper error handling** - Monitor SMS delivery failures
3. **Use templates** - For MSG91, use approved templates for better delivery rates
4. **Monitor costs** - SMS services charge per message
5. **Rate limiting** - Already implemented (1 minute cooldown between OTP requests)

## SMS Message Format

The OTP SMS message format:
```
Your Tatya OTP is {OTP_CODE}. Valid for 5 minutes. Do not share this code.
```

## Troubleshooting

### SMS not sending
- Check if `sms.enabled=true` in properties
- Verify credentials are correct
- Check application logs for error messages
- Ensure phone number format is correct (+91XXXXXXXXXX for India)

### Twilio errors
- Verify Account SID and Auth Token
- Ensure phone number is verified (for trial accounts)
- Check Twilio console for delivery status

### MSG91 errors
- Verify Auth Key is correct
- Ensure template ID is set correctly
- Check MSG91 dashboard for delivery reports



