# API Services

This directory contains API service functions for communicating with the backend.

## API Configuration

The API base URL is configured in `api.js`. By default, it points to:
- `http://localhost:8080/api`

To change the API URL, update the `API_BASE_URL` constant in `api.js`.

## Available Functions

### `generateOtp(phoneNumber)`
Generates an OTP for the given phone number.

**Parameters:**
- `phoneNumber` (string): 10-digit phone number

**Returns:** Promise resolving to API response object

**Example:**
```javascript
import { generateOtp } from '../services/api'

const response = await generateOtp('1234567890')
if (response.success) {
  console.log('OTP generated:', response.data)
}
```

### `verifyOtp(phoneNumber, otpCode)`
Verifies an OTP code for the given phone number.

**Parameters:**
- `phoneNumber` (string): 10-digit phone number
- `otpCode` (string): 4-digit OTP code

**Returns:** Promise resolving to API response object

**Example:**
```javascript
import { verifyOtp } from '../services/api'

const response = await verifyOtp('1234567890', '1234')
if (response.success) {
  console.log('OTP verified successfully')
}
```

### `checkApiHealth()`
Checks if the API is available and running.

**Returns:** Promise resolving to health check response

## Error Handling

All functions throw errors that should be caught using try-catch blocks:

```javascript
try {
  const response = await generateOtp(phoneNumber)
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error.message)
}
```

## Backend Requirements

Make sure the Spring Boot backend is running on `http://localhost:8080` before using these functions.

