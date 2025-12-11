# Tatya Backend API

Spring Boot backend application for Tatya Agricultural Drone Services with OTP authentication.

## Features

- OTP generation and verification
- MySQL database integration
- RESTful API endpoints
- CORS configuration for React frontend
- Input validation
- Error handling

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS tatyaapp;
```

Or the application will create it automatically if `createDatabaseIfNotExist=true` is set in the connection URL.

### 2. Configure Database

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Generate OTP
```
POST /api/otp/generate
Content-Type: application/json

{
  "phoneNumber": "1234567890"
}

Response:
{
  "success": true,
  "message": "OTP generated successfully. Please check your phone.",
  "data": "1234"
}
```

### Verify OTP
```
POST /api/otp/verify
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "otpCode": "1234"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "data": null
}
```

### Health Check
```
GET /api/otp/health

Response:
{
  "success": true,
  "message": "OTP Service is running",
  "data": null
}
```

## Database Schema

The application automatically creates the `otps` table with the following structure:

- `id` - Primary key
- `phone_number` - Phone number (10 digits)
- `otp_code` - OTP code (4 digits)
- `created_at` - Creation timestamp
- `expires_at` - Expiration timestamp
- `is_used` - Whether OTP has been used
- `attempts` - Number of verification attempts

## Configuration

- OTP expiry: 5 minutes (configurable via `otp.expiry.minutes`)
- OTP length: 4 digits (configurable via `otp.length`)
- Max verification attempts: 5
- Resend cooldown: 1 minute

## Production Considerations

1. **SMS Integration**: Integrate with SMS service (Twilio, AWS SNS, etc.) to send OTPs
2. **Remove OTP from Response**: Don't return OTP in API response in production
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Security**: Use HTTPS, add authentication tokens, implement proper security headers
5. **Logging**: Configure proper logging and monitoring
6. **Environment Variables**: Use environment variables for sensitive configuration

## Testing

Test the API using curl or Postman:

```bash
# Generate OTP
curl -X POST http://localhost:8080/api/otp/generate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890"}'

# Verify OTP
curl -X POST http://localhost:8080/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890","otpCode":"1234"}'
```

