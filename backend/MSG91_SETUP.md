# MSG91 Setup - Get OTP on Your Phone! 📱

## ✅ Perfect for India!

MSG91 is one of the most popular SMS providers in India with excellent delivery rates!

## Quick Setup (5 minutes)

### Step 1: Get Free Auth Key

1. **Visit**: https://msg91.com/
2. **Sign up** (free credits available!)
3. **Login** to your dashboard
4. **Go to** "API" or "Settings" section
5. **Copy** your Auth Key (also called API Key)

### Step 2: Add Auth Key

Open `backend/src/main/resources/application.properties` and add:

```properties
msg91.auth.key=YOUR_AUTH_KEY_HERE
```

Replace `YOUR_AUTH_KEY_HERE` with the Auth Key you copied.

### Step 3: Restart Application

Restart your Spring Boot application.

### Step 4: Test!

Request an OTP and **check your phone** - you'll receive SMS! 🎉

## Configuration

Your `application.properties` should look like:

```properties
# SMS Configuration - MSG91 (Perfect for India!)
msg91.auth.key=your_auth_key_here
msg91.sender.id=TATYA
msg91.route=4
msg91.country.code=91
sms.enabled=true
```

### Configuration Options

- **msg91.auth.key** - Your MSG91 Auth Key (required)
- **msg91.sender.id** - Sender ID (default: TATYA, max 6 characters)
- **msg91.route** - Route type (4 = transactional SMS)
- **msg91.country.code** - Country code (91 for India)

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
✅ **Free credits available**  
✅ **Excellent delivery rates**  
✅ **Reliable service**  
✅ **Popular in India**

## MSG91 Free Tier

- **Free credits** available for new accounts
- **Perfect for testing** and development
- **Upgrade** when ready for production
- **Pay-as-you-go** pricing available

## Troubleshooting

### SMS Not Received?

1. **Check Auth Key** - Make sure it's correct in `application.properties`
2. **Check phone number** - Should be 10 digits (e.g., 9876543210)
3. **Check logs** - Application logs will show if SMS was sent
4. **Verify Auth Key** - Make sure your MSG91 account is active
5. **Check MSG91 dashboard** - See delivery status and balance
6. **Check sender ID** - Make sure it's approved (may take time for new accounts)

### Auth Key Issues?

- Make sure you copied the full Auth Key
- No extra spaces before/after the key
- Restart application after adding key
- Verify key is active in MSG91 dashboard

### Sender ID Issues?

- Sender ID must be approved by MSG91
- For new accounts, use default sender ID first
- Max 6 characters
- May take time to get approved

## MSG91 Dashboard

- **Check balance**: Login to MSG91 dashboard
- **View reports**: See delivery status
- **Manage sender IDs**: Add/approve sender IDs
- **API documentation**: https://msg91.com/help/api

## That's It!

Once you add your Auth Key, SMS will work immediately! 🚀

Your OTP will be sent directly to your phone number in India.

## Need Help?

- MSG91 Support: https://msg91.com/support
- API Documentation: https://msg91.com/help/api
- Check application logs for detailed error messages

