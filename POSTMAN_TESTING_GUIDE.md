# Postman Testing Guide for TaskRabbit APIs

## Prerequisites

1. **Start the Backend Server:**
   ```bash
   cd c:\Projects\taskrabbit-customer
   npm start
   ```
   Server should run on `http://localhost:5000`

2. **Set up MySQL Database:**
   ```sql
   CREATE DATABASE taskrabbit;
   USE taskrabbit;
   SOURCE schema.sql;
   ```

3. **Open Postman** and create a new collection named "TaskRabbit API"

---

## Testing Order (Recommended)

### Phase 1: Guest APIs (No Authentication Required)

#### 1. Get All Categories
- **Method:** GET
- **URL:** `http://localhost:5000/api/guest/categories`
- **Headers:** None required
- **Expected Response:** Array of categories with sample data

#### 2. Get Subcategories by Category
- **Method:** GET
- **URL:** `http://localhost:5000/api/guest/subcategories/1`
- **Headers:** None required
- **Expected Response:** Array of subcategories for category_id=1 (Plumbing, Electrical, Carpentry)

#### 3. Get Services by Subcategory
- **Method:** GET
- **URL:** `http://localhost:5000/api/guest/services/1`
- **Headers:** None required
- **Expected Response:** Array of services for subcategory_id=1 (Pipe Repair, Drain Cleaning)

#### 4. Get Service Details
- **Method:** GET
- **URL:** `http://localhost:5000/api/guest/service/1`
- **Headers:** None required
- **Expected Response:** Single service details for service_id=1

#### 5. Get Providers by Service
- **Method:** GET
- **URL:** `http://localhost:5000/api/guest/providers/1`
- **Headers:** None required
- **Expected Response:** Array of providers who offer service_id=1

---

### Phase 2: Customer Authentication

#### 6. Register Customer
- **Method:** POST
- **URL:** `http://localhost:5000/api/customers/register`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Test Customer",
    "email": "testcustomer@example.com",
    "phone": "555-9999",
    "password": "password123"
  }
  ```
- **Expected Response:** 
  ```json
  {
    "success": true,
    "message": "Customer registered successfully"
  }
  ```
- **Note:** Check console for OTP (4-digit number)

#### 7. Verify OTP
- **Method:** POST
- **URL:** `http://localhost:5000/api/customers/verify-otp`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testcustomer@example.com",
    "otp": "1234"
  }
  ```
- **Expected Response:** 
  ```json
  {
    "success": true,
    "message": "OTP verified successfully"
  }
  ```

#### 8. Login Customer
- **Method:** POST
- **URL:** `http://localhost:5000/api/customers/login`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testcustomer@example.com",
    "password": "password123"
  }
  ```
- **Expected Response:** 
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Important:** Copy the token for authenticated requests

---

### Phase 3: Customer Profile (Authentication Required)

#### 9. Get Customer Profile
- **Method:** GET
- **URL:** `http://localhost:5000/api/customers/profile`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
  ```
- **Expected Response:** Customer profile data

#### 10. Update Customer Profile
- **Method:** PUT
- **URL:** `http://localhost:5000/api/customers/update-profile`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Updated Name",
    "phone": "555-8888"
  }
  ```
- **Expected Response:** Success message

#### 11. Change Password
- **Method:** PUT
- **URL:** `http://localhost:5000/api/customers/change-password`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
  ```
- **Body (raw JSON):**
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```
- **Expected Response:** Success message

#### 12. Logout Customer
- **Method:** POST
- **URL:** `http://localhost:5000/api/customers/logout`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
  ```
- **Expected Response:** Success message

---

### Phase 4: Booking APIs

#### 13. Create Booking
- **Method:** POST
- **URL:** `http://localhost:5000/api/bookings/create`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
  ```
- **Body (raw JSON):**
  ```json
  {
    "provider_id": 1,
    "service_id": 1,
    "scheduled_date": "2024-12-20T10:00:00.000Z",
    "duration_hours": 2,
    "address": "123 Test Street, Test City, Test State",
    "notes": "Test booking",
    "total_amount": 150.00
  }
  ```
- **Expected Response:** Booking created with booking_id

#### 14. Get Customer Bookings
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/customer/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Array of customer bookings

#### 15. Get Booking by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Single booking details

#### 16. Cancel Booking
- **Method:** PUT
- **URL:** `http://localhost:5000/api/bookings/1/cancel`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Success message

#### 17. Reschedule Booking
- **Method:** PUT
- **URL:** `http://localhost:5000/api/bookings/1/reschedule`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "scheduled_date": "2024-12-21T14:00:00.000Z"
  }
  ```
- **Expected Response:** Success message

---

### Phase 5: Payment APIs

#### 18. Create Payment
- **Method:** POST
- **URL:** `http://localhost:5000/api/payments/create`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "booking_id": 1,
    "customer_id": 1,
    "amount": 150.00,
    "payment_method": "credit_card"
  }
  ```
- **Expected Response:** Payment created with payment_id

#### 19. Get Payment by Booking
- **Method:** GET
- **URL:** `http://localhost:5000/api/payments/booking/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Payment details for booking

---

### Phase 6: Wallet APIs

#### 20. Create Wallet
- **Method:** POST
- **URL:** `http://localhost:5000/api/wallet/create`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "customer_id": 1
  }
  ```
- **Expected Response:** Wallet created with wallet_id

#### 21. Get Wallet Balance
- **Method:** GET
- **URL:** `http://localhost:5000/api/wallet/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Wallet balance details

#### 22. Add Money to Wallet
- **Method:** POST
- **URL:** `http://localhost:5000/api/wallet/add-money`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "customer_id": 1,
    "amount": 100.00,
    "description": "Test top-up"
  }
  ```
- **Expected Response:** Success message with updated balance

#### 23. Deduct Money from Wallet
- **Method:** POST
- **URL:** `http://localhost:5000/api/wallet/deduct-money`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "customer_id": 1,
    "amount": 50.00,
    "description": "Test deduction"
  }
  ```
- **Expected Response:** Success message with updated balance

#### 24. Get Transaction History
- **Method:** GET
- **URL:** `http://localhost:5000/api/wallet/transactions/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Array of wallet transactions

---

### Phase 7: Tasker APIs

#### 25. Register Tasker
- **Method:** POST
- **URL:** `http://localhost:5000/api/taskers/register`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Test Tasker",
    "email": "testtasker@example.com",
    "password": "password123",
    "phone": "555-7777",
    "skills": "Plumbing, Electrical",
    "experience": "5 years",
    "location": "New York"
  }
  ```
- **Expected Response:** Success message
- **Note:** Check console for OTP

#### 26. Verify Tasker OTP
- **Method:** POST
- **URL:** `http://localhost:5000/api/taskers/verify-otp`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testtasker@example.com",
    "otp": "1234"
  }
  ```
- **Expected Response:** Success message

#### 27. Login Tasker
- **Method:** POST
- **URL:** `http://localhost:5000/api/taskers/login`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "testtasker@example.com",
    "password": "password123"
  }
  ```
- **Expected Response:** 
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Important:** Copy the token for authenticated requests

#### 28. Get Tasker Profile
- **Method:** GET
- **URL:** `http://localhost:5000/api/taskers/profile`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_tasker_token_here>
  ```
- **Expected Response:** Tasker profile data

#### 29. Update Tasker Profile
- **Method:** PUT
- **URL:** `http://localhost:5000/api/taskers/update-profile`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <paste_tasker_token_here>
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Updated Tasker Name",
    "phone": "555-6666",
    "skills": "Plumbing, Electrical, HVAC",
    "bio": "Experienced professional",
    "hourly_rate": 70.00
  }
  ```
- **Expected Response:** Success message

#### 30. Get Provider Bookings
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/provider/1`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Array of provider bookings

#### 31. Accept Booking (Provider Action)
- **Method:** PUT
- **URL:** `http://localhost:5000/api/bookings/1/accept`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Success message

#### 32. Complete Booking (Provider Action)
- **Method:** PUT
- **URL:** `http://localhost:5000/api/bookings/1/complete`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Expected Response:** Success message

---

## Postman Collection Setup Tips

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:5000/api`
   - `customer_token`: (paste after login)
   - `tasker_token`: (paste after tasker login)

2. **Use Variables in URLs:**
   - Instead of `http://localhost:5000/api/guest/categories`
   - Use `{{base_url}}/guest/categories`

3. **Set Authorization Header Automatically:**
   - In request settings, set Type to "Bearer Token"
   - Use `{{customer_token}}` or `{{tasker_token}}`

---

## Common Issues & Solutions

### Issue: "MySQL connection failed"
**Solution:** 
- Ensure MySQL server is running
- Check .env file for correct DB credentials
- Create database: `CREATE DATABASE taskrabbit;`
- Import schema: `mysql -u root -p taskrabbit < schema.sql`

### Issue: "Customer already exists"
**Solution:** 
- Use a different email address for registration
- Or delete existing customer from database

### Issue: "Invalid OTP"
**Solution:** 
- Check server console for OTP output
- OTP is valid for 5 minutes
- Use resend-otp endpoint if expired

### Issue: "Unauthorized" / 401 error
**Solution:** 
- Ensure you're logged in and have a valid token
- Check Authorization header format: `Bearer <token>`
- Token expires in 7 days, login again if expired

### Issue: "Booking not found"
**Solution:** 
- Ensure booking_id exists in database
- Check if you're using correct customer_id

---

## Testing Checklist

- [ ] Server running on port 5000
- [ ] Database created and schema imported
- [ ] Guest APIs working (no auth)
- [ ] Customer registration working
- [ ] Customer login working (token received)
- [ ] Customer profile operations working
- [ ] Booking creation working
- [ ] Booking retrieval working
- [ ] Payment creation working
- [ ] Wallet operations working
- [ ] Tasker registration working
- [ ] Tasker login working (token received)
- [ ] Tasker profile operations working
- [ ] Provider booking operations working

---

## Sample Test Data

**Customer:**
- Email: testcustomer@example.com
- Password: password123
- Name: Test Customer

**Tasker:**
- Email: testtasker@example.com
- Password: password123
- Name: Test Tasker

**Booking:**
- Provider ID: 1 (from sample data)
- Service ID: 1 (from sample data)
- Date: Any future date
- Duration: 2 hours
- Amount: 150.00
