# TaskRabbit API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. GUEST APIs (No Authentication Required)

### 1.1 Get All Categories
- **Endpoint:** `/guest/categories`
- **Method:** `GET`
- **Description:** Get all service categories
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Home Services",
      "description": "Professional home maintenance and repair services",
      "image_url": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 1.2 Get Subcategories by Category
- **Endpoint:** `/guest/subcategories/:categoryId`
- **Method:** `GET`
- **Description:** Get all subcategories for a specific category
- **Params:** `categoryId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "subcategory_id": 1,
      "category_id": 1,
      "subcategory_name": "Plumbing",
      "description": "Professional plumbing services",
      "image_url": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 1.3 Get Services by Subcategory
- **Endpoint:** `/guest/services/:subcategoryId`
- **Method:** `GET`
- **Description:** Get all services for a specific subcategory
- **Params:** `subcategoryId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "service_id": 1,
      "subcategory_id": 1,
      "service_name": "Pipe Repair",
      "description": "Fix leaking pipes and plumbing issues",
      "base_price": 75.00,
      "duration_hours": 2,
      "image_url": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 1.4 Get Service Details
- **Endpoint:** `/guest/service/:serviceId`
- **Method:** `GET`
- **Description:** Get details for a specific service
- **Params:** `serviceId` (integer)
- **Response:**
```json
{
  "data": {
    "service_id": 1,
    "subcategory_id": 1,
    "service_name": "Pipe Repair",
    "description": "Fix leaking pipes and plumbing issues",
    "base_price": 75.00,
    "duration_hours": 2,
    "image_url": "https://...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 1.5 Get Providers by Service
- **Endpoint:** `/guest/providers/:serviceId`
- **Method:** `GET`
- **Description:** Get all service providers for a specific service
- **Params:** `serviceId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "provider_id": 1,
      "name": "John Smith",
      "phone": "555-0101",
      "email": "john@tasker.com",
      "rating": 4.5,
      "experience": "10 years"
    }
  ]
}
```

---

## 2. CUSTOMER APIs

### 2.1 Register Customer
- **Endpoint:** `/customers/register`
- **Method:** `POST`
- **Description:** Register a new customer
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Customer registered successfully"
}
```

### 2.2 Verify OTP
- **Endpoint:** `/customers/verify-otp`
- **Method:** `POST`
- **Description:** Verify customer email with OTP
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### 2.3 Resend OTP
- **Endpoint:** `/customers/resend-otp`
- **Method:** `POST`
- **Description:** Resend OTP to customer email
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

### 2.4 Forgot Password
- **Endpoint:** `/customers/forgot-password`
- **Method:** `POST`
- **Description:** Request password reset OTP
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP sent for password reset"
}
```

### 2.5 Reset Password
- **Endpoint:** `/customers/reset-password`
- **Method:** `POST`
- **Description:** Reset password with OTP
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234",
  "newPassword": "newpassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 2.6 Login Customer
- **Endpoint:** `/customers/login`
- **Method:** `POST`
- **Description:** Login customer and get JWT token
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2.7 Get Customer Profile (Auth Required)
- **Endpoint:** `/customers/profile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }
}
```

### 2.8 Update Customer Profile (Auth Required)
- **Endpoint:** `/customers/update-profile`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "John Doe",
  "phone": "555-5678"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### 2.9 Logout Customer (Auth Required)
- **Endpoint:** `/customers/logout`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 2.10 Change Password (Auth Required)
- **Endpoint:** `/customers/change-password`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 2.11 Delete Account (Auth Required)
- **Endpoint:** `/customers/delete-account`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 3. BOOKING APIs

### 3.1 Create Booking
- **Endpoint:** `/bookings/create`
- **Method:** `POST`
- **Description:** Create a new booking
- **Request Body:**
```json
{
  "provider_id": 1,
  "service_id": 1,
  "scheduled_date": "2024-12-01T10:00:00.000Z",
  "duration_hours": 2,
  "address": "123 Main St, City, State",
  "notes": "Please bring your own tools",
  "total_amount": 150.00
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": 1,
    "customer_id": 1,
    "provider_id": 1,
    "service_id": 1,
    "scheduled_date": "2024-12-01T10:00:00.000Z",
    "duration_hours": 2,
    "status": "pending",
    "total_amount": 150.00,
    "address": "123 Main St, City, State",
    "notes": "Please bring your own tools"
  }
}
```

### 3.2 Get Customer Bookings
- **Endpoint:** `/bookings/customer/:customerId`
- **Method:** `GET`
- **Description:** Get all bookings for a customer
- **Params:** `customerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 1,
      "customer_id": 1,
      "provider_id": 1,
      "service_id": 1,
      "scheduled_date": "2024-12-01T10:00:00.000Z",
      "duration_hours": 2,
      "status": "pending",
      "total_amount": 150.00,
      "address": "123 Main St, City, State",
      "notes": "Please bring your own tools"
    }
  ]
}
```

### 3.3 Get Provider Bookings
- **Endpoint:** `/bookings/provider/:providerId`
- **Method:** `GET`
- **Description:** Get all bookings for a provider
- **Params:** `providerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 1,
      "customer_id": 1,
      "provider_id": 1,
      "service_id": 1,
      "scheduled_date": "2024-12-01T10:00:00.000Z",
      "duration_hours": 2,
      "status": "pending",
      "total_amount": 150.00,
      "address": "123 Main St, City, State",
      "notes": "Please bring your own tools"
    }
  ]
}
```

### 3.4 Accept Booking
- **Endpoint:** `/bookings/:bookingId/accept`
- **Method:** `PUT`
- **Description:** Provider accepts a booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "Booking accepted successfully"
}
```

### 3.5 Reject Booking
- **Endpoint:** `/bookings/:bookingId/reject`
- **Method:** `PUT`
- **Description:** Provider rejects a booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "Booking rejected successfully"
}
```

### 3.6 Complete Booking
- **Endpoint:** `/bookings/:bookingId/complete`
- **Method:** `PUT`
- **Description:** Mark booking as completed
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "Booking completed successfully"
}
```

### 3.7 Get Booking by ID
- **Endpoint:** `/bookings/:bookingId`
- **Method:** `GET`
- **Description:** Get details of a specific booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": {
    "booking_id": 1,
    "customer_id": 1,
    "provider_id": 1,
    "service_id": 1,
    "scheduled_date": "2024-12-01T10:00:00.000Z",
    "duration_hours": 2,
    "status": "pending",
    "total_amount": 150.00,
    "address": "123 Main St, City, State",
    "notes": "Please bring your own tools"
  }
}
```

### 3.8 Cancel Booking
- **Endpoint:** `/bookings/:bookingId/cancel`
- **Method:** `PUT`
- **Description:** Cancel a booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### 3.9 Reschedule Booking
- **Endpoint:** `/bookings/:bookingId/reschedule`
- **Method:** `PUT`
- **Description:** Reschedule a booking
- **Params:** `bookingId` (integer)
- **Request Body:**
```json
{
  "scheduled_date": "2024-12-02T14:00:00.000Z"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Booking rescheduled successfully"
}
```

### 3.10 Get Customer Booking History
- **Endpoint:** `/bookings/customer/:customerId/history`
- **Method:** `GET`
- **Description:** Get booking history for a customer
- **Params:** `customerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 1,
      "customer_id": 1,
      "provider_id": 1,
      "service_id": 1,
      "scheduled_date": "2024-12-01T10:00:00.000Z",
      "duration_hours": 2,
      "status": "completed",
      "total_amount": 150.00,
      "address": "123 Main St, City, State",
      "notes": "Please bring your own tools"
    }
  ]
}
```

### 3.11 Get Upcoming Bookings
- **Endpoint:** `/bookings/customer/:customerId/upcoming`
- **Method:** `GET`
- **Description:** Get upcoming bookings for a customer
- **Params:** `customerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 2,
      "customer_id": 1,
      "provider_id": 1,
      "service_id": 1,
      "scheduled_date": "2024-12-15T10:00:00.000Z",
      "duration_hours": 2,
      "status": "confirmed",
      "total_amount": 150.00,
      "address": "123 Main St, City, State",
      "notes": "Please bring your own tools"
    }
  ]
}
```

### 3.12 Get Booking Status
- **Endpoint:** `/bookings/:bookingId/status`
- **Method:** `GET`
- **Description:** Get status of a specific booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": {
    "booking_id": 1,
    "status": "pending"
  }
}
```

---

## 4. PAYMENT APIs

### 4.1 Create Payment
- **Endpoint:** `/payments/create`
- **Method:** `POST`
- **Description:** Create a payment for a booking
- **Request Body:**
```json
{
  "booking_id": 1,
  "customer_id": 1,
  "amount": 150.00,
  "payment_method": "credit_card"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 1,
    "booking_id": 1,
    "customer_id": 1,
    "amount": 150.00,
    "payment_method": "credit_card",
    "payment_status": "pending",
    "transaction_id": "txn_123456789",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 4.2 Get Payment by Booking
- **Endpoint:** `/payments/booking/:bookingId`
- **Method:** `GET`
- **Description:** Get payment details for a booking
- **Params:** `bookingId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": 1,
    "booking_id": 1,
    "customer_id": 1,
    "amount": 150.00,
    "payment_method": "credit_card",
    "payment_status": "completed",
    "transaction_id": "txn_123456789",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

## 5. WALLET APIs

### 5.1 Create Wallet
- **Endpoint:** `/wallet/create`
- **Method:** `POST`
- **Description:** Create a wallet for a customer
- **Request Body:**
```json
{
  "customer_id": 1
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Wallet created successfully",
  "data": {
    "wallet_id": 1,
    "customer_id": 1,
    "balance": 0.00,
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 5.2 Get Wallet Balance
- **Endpoint:** `/wallet/:customerId`
- **Method:** `GET`
- **Description:** Get wallet balance for a customer
- **Params:** `customerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": {
    "wallet_id": 1,
    "customer_id": 1,
    "balance": 500.00,
    "created_at": "2024-12-01T10:00:00.000Z",
    "updated_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 5.3 Add Money to Wallet
- **Endpoint:** `/wallet/add-money`
- **Method:** `POST`
- **Description:** Add money to wallet
- **Request Body:**
```json
{
  "customer_id": 1,
  "amount": 100.00,
  "description": "Wallet top-up"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Money added to wallet successfully",
  "data": {
    "wallet_id": 1,
    "customer_id": 1,
    "balance": 600.00,
    "updated_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 5.4 Deduct Money from Wallet
- **Endpoint:** `/wallet/deduct-money`
- **Method:** `POST`
- **Description:** Deduct money from wallet
- **Request Body:**
```json
{
  "customer_id": 1,
  "amount": 50.00,
  "description": "Payment for booking"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Money deducted from wallet successfully",
  "data": {
    "wallet_id": 1,
    "customer_id": 1,
    "balance": 550.00,
    "updated_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 5.5 Get Transaction History
- **Endpoint:** `/wallet/transactions/:customerId`
- **Method:** `GET`
- **Description:** Get wallet transaction history
- **Params:** `customerId` (integer)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "transaction_id": 1,
      "wallet_id": 1,
      "transaction_type": "credit",
      "amount": 100.00,
      "description": "Wallet top-up",
      "created_at": "2024-12-01T10:00:00.000Z"
    },
    {
      "transaction_id": 2,
      "wallet_id": 1,
      "transaction_type": "debit",
      "amount": 50.00,
      "description": "Payment for booking",
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

---

## 6. TASKER (SERVICE PROVIDER) APIs

### 6.1 Register Tasker
- **Endpoint:** `/taskers/register`
- **Method:** `POST`
- **Description:** Register a new service provider
- **Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@tasker.com",
  "password": "password123",
  "phone": "555-0101",
  "skills": "Plumbing, Electrical",
  "experience": "10 years",
  "location": "New York"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Tasker registered successfully"
}
```

### 6.2 Verify Tasker OTP
- **Endpoint:** `/taskers/verify-otp`
- **Method:** `POST`
- **Description:** Verify tasker email with OTP
- **Request Body:**
```json
{
  "email": "john@tasker.com",
  "otp": "1234"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### 6.3 Resend Tasker OTP
- **Endpoint:** `/taskers/resend-otp`
- **Method:** `POST`
- **Description:** Resend OTP to tasker email
- **Request Body:**
```json
{
  "email": "john@tasker.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

### 6.4 Login Tasker
- **Endpoint:** `/taskers/login`
- **Method:** `POST`
- **Description:** Login tasker and get JWT token
- **Request Body:**
```json
{
  "email": "john@tasker.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6.5 Get Tasker Profile (Auth Required)
- **Endpoint:** `/taskers/profile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "provider_id": 1,
    "name": "John Smith",
    "email": "john@tasker.com",
    "phone": "555-0101",
    "rating": 4.5,
    "total_reviews": 120,
    "experience": "10 years",
    "skills": "Plumbing, Electrical",
    "bio": "Experienced handyman",
    "hourly_rate": 65.00
  }
}
```

### 6.6 Update Tasker Profile (Auth Required)
- **Endpoint:** `/taskers/update-profile`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "John Smith",
  "phone": "555-0102",
  "skills": "Plumbing, Electrical, HVAC",
  "bio": "Experienced handyman with HVAC certification",
  "hourly_rate": 70.00
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### 6.7 Forgot Tasker Password
- **Endpoint:** `/taskers/forgot-password`
- **Method:** `POST`
- **Description:** Request password reset OTP
- **Request Body:**
```json
{
  "email": "john@tasker.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP sent for password reset"
}
```

### 6.8 Change Tasker Password (Auth Required)
- **Endpoint:** `/taskers/change-password`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Error Response Format

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

---

## Database Schema

### Tables:
1. **customers** - Customer accounts
2. **categories** - Service categories
3. **subcategories** - Service subcategories
4. **services** - Individual services
5. **service_providers** - Tasker/service provider accounts
6. **provider_services** - Mapping between providers and services
7. **bookings** - Booking records
8. **payments** - Payment records
9. **wallet** - Customer wallets
10. **wallet_transactions** - Wallet transaction history

---

## Notes

1. All datetime fields are in ISO 8601 format
2. All monetary values are in USD
3. OTP is a 4-digit number valid for 5 minutes
4. JWT tokens expire in 7 days
5. Booking statuses: pending, confirmed, in_progress, completed, cancelled
6. Payment statuses: pending, completed, failed, refunded
