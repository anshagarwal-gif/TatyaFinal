# Free SMS Setup - Receive OTP on Your Phone! 📱

## ✅ No Account Required!

The application is now configured to send **real SMS** to your phone using a **free SMS API**!

## Current Configuration

The app is set to use **free SMS mode**:
```properties
sms.provider=free
```

## How It Works

1. **Request OTP** from your frontend
2. **SMS is sent** to your phone number via free SMS API
3. **Check your phone** for the OTP code
4. **Enter OTP** in your application

## Free SMS API Details

### TextBelt API (Currently Used)
- ✅ **No account signup required**
- ✅ **Free tier available**
- ⚠️ **Limitations:**
  - Free tier: ~1 SMS per day
  - Works best for US/Canada numbers
  - For Indian numbers, may fall back to console logging

### What Happens

1. **First attempt**: Tries to send SMS via free API
2. **If successful**: You receive SMS on your phone! 📱
3. **If fails**: OTP is displayed prominently in console/logs (so you can still test)

## For Indian Phone Numbers

Since free SMS APIs have limitations for international numbers:

### Option 1: Use Free Mode (Current)
- Tries to send SMS
- If it fails, OTP is shown in console
- **Check your console/logs** for the OTP code

### Option 2: Use MSG91 (Recommended for India)
MSG91 offers free credits for new accounts:
1. Sign up at https://msg91.com/ (free credits available)
2. Get your Auth Key
3. Update `application.properties`:
```properties
sms.provider=msg91
msg91.auth.key=your_auth_key_here
```

### Option 3: Use Twilio Trial (Free)
1. Sign up at https://www.twilio.com/try-twilio (free $15 credit)
2. Verify your phone number
3. Get Account SID and Auth Token
4. Update `application.properties`:
```properties
sms.provider=twilio
twilio.account.sid=your_account_sid
twilio.auth.token=your_auth_token
twilio.phone.number=+1234567890
```

## Testing

1. **Start your Spring Boot application**
2. **Request OTP** with your phone number
3. **Check your phone** - you should receive SMS!
4. **If SMS doesn't arrive**, check console logs - OTP will be displayed there

## Console Output

If SMS sending fails (e.g., for Indian numbers), you'll see:
```
╔════════════════════════════════════════════════════════════╗
║              📱 FREE SMS MODE - OTP DISPLAYED               ║
╠════════════════════════════════════════════════════════════╣
║ To: +911234567890                                          ║
║ 🔑 OTP CODE: 1234                                          ║
╚════════════════════════════════════════════════════════════╝
```

## Troubleshooting

### SMS Not Received?

1. **Check console logs** - OTP will be displayed there
2. **Free API limits** - May be rate limited (1 SMS/day)
3. **Phone number format** - Ensure it's 10 digits (for India)
4. **Try MSG91** - Better for Indian numbers (free credits available)

### Want Guaranteed SMS Delivery?

For production or guaranteed delivery, use:
- **MSG91** (best for India, free credits available)
- **Twilio** (global, free trial with $15 credit)

Both offer free tiers/trials that are perfect for testing!

## Summary

✅ **Current setup**: Free SMS mode - tries to send real SMS  
✅ **No account needed**: Works immediately  
✅ **Fallback**: If SMS fails, OTP shown in console  
✅ **For production**: Use MSG91 or Twilio (both have free tiers)

**Your OTP will be sent to your phone or displayed in console!** 🎉

