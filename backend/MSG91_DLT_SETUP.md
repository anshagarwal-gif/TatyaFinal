# MSG91 DLT Registration - Required for India! 🇮🇳

## ⚠️ Important: DLT Registration Required

In India, **DLT (Distributed Ledger Technology) registration is mandatory** for sending SMS. Without DLT registration, SMS will not be delivered even if the API returns success.

## Why SMS Not Received?

If MSG91 API returns a message ID (success) but SMS is not received, it's likely because:

1. **DLT Registration Not Complete** - Most common issue
2. **Sender ID Not Approved** - "TATYA" needs to be registered
3. **Message Template Not Approved** - OTP message template needs DLT approval

## How to Register for DLT

### Step 1: Register Your Entity

1. **Visit**: https://www.dltconnect.in/
2. **Sign up** as a Business Entity
3. **Complete KYC** (Know Your Customer) verification
4. **Get Entity ID** after approval

### Step 2: Register Sender ID in MSG91

1. **Login** to MSG91 dashboard: https://msg91.com/
2. **Go to**: Settings → Sender ID
3. **Add Sender ID**: "TATYA"
4. **Link to DLT Entity**: Connect with your DLT entity ID
5. **Wait for approval** (usually 24-48 hours)

### Step 3: Register Message Template

1. **In MSG91 Dashboard**: Go to Templates
2. **Create Template**:
   - Template Text: `Your Tatya OTP is {#} {#} {#} {#}. Valid for 5 minutes. Do not share this code.`
   - Use `{#}` for OTP digits
   - Category: OTP
   - Purpose: Authentication
3. **Submit for DLT Approval**
4. **Wait for approval** (usually 24-48 hours)

### Step 4: Update Code to Use Template

Once template is approved, update your code to use template ID instead of plain message.

## Quick Alternative: Use MSG91's Default Template

MSG91 provides pre-approved templates. Check your MSG91 dashboard for available templates.

## Check DLT Status

1. **MSG91 Dashboard** → Reports → DLT Status
2. **Check** if sender ID and template are approved
3. **Verify** entity is linked correctly

## Common DLT Errors

- **"Sender ID not registered"** → Register sender ID in MSG91 and link to DLT
- **"Template not approved"** → Create and submit template for approval
- **"Entity not verified"** → Complete KYC on DLT platform

## Temporary Solution (Testing)

For testing purposes, you can:

1. **Use MSG91's test numbers** (if available)
2. **Check console logs** - OTP is displayed there
3. **Wait for DLT approval** - Then SMS will work

## Timeline

- **DLT Registration**: 1-2 business days
- **Sender ID Approval**: 24-48 hours
- **Template Approval**: 24-48 hours

**Total**: Usually 3-5 business days for complete setup

## Need Help?

- **MSG91 Support**: https://msg91.com/support
- **DLT Support**: https://www.dltconnect.in/support
- **Check MSG91 Dashboard**: For detailed error messages

## Summary

✅ **API is working** (returns message ID)  
❌ **DLT not registered** (SMS blocked by regulations)  
📋 **Action Required**: Complete DLT registration and template approval

Once DLT is complete, SMS will be delivered successfully! 🎉



