# Fast2SMS Setup - Get OTP on Your Phone! 📱

## ✅ Perfect for India!

Fast2SMS is specifically designed for Indian phone numbers and works perfectly!

## Quick Setup (5 minutes)

### Step 1: Get Free API Key

1. **Visit**: https://www.fast2sms.com/
2. **Sign up** (it's free!)
3. **Login** to your dashboard
4. **Go to** "API" section
5. **Copy** your API key

### Step 2: Add API Key

Open `backend/src/main/resources/application.properties` and add:

```properties
fast2sms.api.key=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with the API key you copied.

### Step 3: Restart Application

Restart your Spring Boot application.

### Step 4: Test!

Request an OTP and **check your phone** - you'll receive SMS! 🎉

## Configuration

Your `application.properties` should look like:

```properties
# SMS Configuration - Fast2SMS (Works perfectly for India!)
fast2sms.api.key=your_api_key_here
fast2sms.route=qt
fast2sms.flash=0
sms.enabled=true
```

## Test SMS Status

Check if SMS is configured correctly:

```bash
GET http://localhost:8080/api/sms/status
```

## Test SMS Sending

Test sending SMS:

```bash
POST http://localhost:8080/api/sms/test?phoneNumber=1234567890
```

## Features

✅ **Works perfectly for Indian numbers**  
✅ **Free tier available**  
✅ **Fast delivery**  
✅ **Reliable service**  
✅ **No complex setup**

## Troubleshooting

### SMS Not Received?

1. **Check API key** - Make sure it's correct in `application.properties`
2. **Check phone number** - Should be 10 digits (e.g., 9876543210)
3. **Check logs** - Application logs will show if SMS was sent
4. **Verify API key** - Make sure your Fast2SMS account is active
5. **Check Fast2SMS dashboard** - See delivery status

### API Key Issues?

- Make sure you copied the full API key
- No extra spaces before/after the key
- Restart application after adding key

## Fast2SMS Free Tier

- **Free credits** available for new accounts
- **Perfect for testing** and development
- **Upgrade** when ready for production

## That's It!

Once you add your API key, SMS will work immediately! 🚀

Your OTP will be sent directly to your phone number in India.



