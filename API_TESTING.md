# 🧪 TraceRoot API Testing Guide

**Base URLs:**
- Auth Service: `http://localhost:8001`
- Trace Service: `http://localhost:8002`
- Blockchain Service: `http://localhost:8003`

---

## 🔐 Auth Service (Port 8001)

### Register User
```http
POST http://localhost:8001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "supplier"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "id": "65abc123def456789",
      "email": "test@example.com",
      "name": "Test User",
      "role": "supplier"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "User registered successfully",
  "success": true
}
```

---

### Login
```http
POST http://localhost:8001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "65abc123def456789",
      "email": "test@example.com",
      "name": "Test User",
      "role": "supplier"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "Login successful",
  "success": true
}
```

---

### Refresh Token
```http
POST http://localhost:8001/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "NEW_REFRESH_TOKEN"
  },
  "message": "Token refreshed",
  "success": true
}
```

---

### Get Profile (Protected)
```http
GET http://localhost:8001/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65abc123def456789",
    "email": "test@example.com",
    "name": "Test User",
    "role": "supplier",
    "phone": "+1234567890",
    "organization": "Farm Co",
    "isActive": true,
    "createdAt": "2026-02-07T12:00:00.000Z",
    "updatedAt": "2026-02-07T12:00:00.000Z"
  },
  "message": "Profile fetched",
  "success": true
}
```

---

### Update Profile (Protected)
```http
PUT http://localhost:8001/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "organization": "TraceRoot Inc"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65abc123def456789",
    "email": "test@example.com",
    "name": "Updated Name",
    "role": "supplier",
    "phone": "+1234567890",
    "organization": "TraceRoot Inc"
  },
  "message": "Profile updated",
  "success": true
}
```

---

### Forgot Password
```http
POST http://localhost:8001/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "If the email exists, a reset link will be sent",
  "success": true
}
```

---

### Reset Password
```http
POST http://localhost:8001/api/auth/reset-password
Content-Type: application/json

{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Password reset successfully",
  "success": true
}
```

---

### Logout
```http
POST http://localhost:8001/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Logged out successfully",
  "success": true
}
```

---

### Get All Users (Admin Only)
```http
GET http://localhost:8001/api/auth/users?page=1&limit=10
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "65abc123def456789",
        "email": "admin@example.com",
        "name": "Admin User",
        "role": "admin",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  },
  "message": "Users fetched",
  "success": true
}
```

---

### Update User Role (Admin Only)
```http
PUT http://localhost:8001/api/auth/users/USER_ID/role
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "role": "manufacturer"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "USER_ID",
    "email": "user@example.com",
    "name": "User",
    "role": "manufacturer"
  },
  "message": "User role updated",
  "success": true
}
```

---

## 📦 Trace Service (Port 8002)

### Create Batch (Supplier/Admin)
```http
POST http://localhost:8002/api/batches
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "productName": "Organic Turmeric",
  "variety": "Erode",
  "quantity": 1000,
  "unit": "kg",
  "origin": "Tamil Nadu, India",
  "harvestDate": "2026-02-01",
  "expiryDate": "2027-02-01",
  "nfcTagId": "NFC-001",
  "quality": "Premium"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65abc123def456789",
    "batchId": "BATCH-1707312000000-ABCD1234",
    "batchNumber": "TR-2026-312000",
    "productName": "Organic Turmeric",
    "variety": "Erode",
    "quantity": 1000,
    "unit": "kg",
    "origin": "Tamil Nadu, India",
    "status": "Created",
    "quality": "Premium",
    "nfcTagId": "NFC-001",
    "createdBy": "65abc123def456789",
    "createdAt": "2026-02-07T12:00:00.000Z"
  },
  "message": "Batch created successfully",
  "success": true
}
```

---

### Get All Batches
```http
GET http://localhost:8002/api/batches?page=1&limit=10&status=Created
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "batches": [
      {
        "_id": "65abc123def456789",
        "batchId": "BATCH-1707312000000-ABCD1234",
        "productName": "Organic Turmeric",
        "status": "Created",
        "quality": "Premium",
        "quantity": 1000,
        "unit": "kg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "message": "Batches fetched",
  "success": true
}
```

---

### Get Batch by ID
```http
GET http://localhost:8002/api/batches/BATCH_MONGO_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65abc123def456789",
    "batchId": "BATCH-1707312000000-ABCD1234",
    "productName": "Organic Turmeric",
    "variety": "Erode",
    "quantity": 1000,
    "status": "Processing",
    "currentLocation": "Chennai Processing Plant",
    "qualityMetrics": [
      {
        "_id": "65xyz789",
        "metricType": "curcumin_content",
        "value": "5.2",
        "unit": "%",
        "passed": true
      }
    ],
    "statusHistory": [
      {
        "status": "Created",
        "location": "Farm, Tamil Nadu",
        "createdAt": "2026-02-07T10:00:00.000Z"
      },
      {
        "status": "Processing",
        "location": "Chennai Processing Plant",
        "createdAt": "2026-02-07T12:00:00.000Z"
      }
    ]
  },
  "message": "Batch fetched",
  "success": true
}
```

---

### Add Quality Metric (Manufacturer)
```http
POST http://localhost:8002/api/batches/BATCH_MONGO_ID/quality
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "metricType": "curcumin_content",
  "value": "5.2",
  "unit": "%",
  "passed": true,
  "notes": "Excellent quality"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65xyz789qwerty",
    "batchId": "65abc123def456789",
    "metricType": "curcumin_content",
    "value": "5.2",
    "unit": "%",
    "passed": true,
    "notes": "Excellent quality",
    "inspectorId": "65inspector123",
    "createdAt": "2026-02-07T12:30:00.000Z"
  },
  "message": "Quality metric added",
  "success": true
}
```

---

### Update Batch Status
```http
PUT http://localhost:8002/api/batches/BATCH_MONGO_ID/status
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "In Transit",
  "location": "Highway 44, Chennai",
  "notes": "En route to distribution center"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65abc123def456789",
    "batchId": "BATCH-1707312000000-ABCD1234",
    "status": "In Transit",
    "currentLocation": "Highway 44, Chennai",
    "lastUpdated": "2026-02-07T14:00:00.000Z"
  },
  "message": "Status updated",
  "success": true
}
```

---

### Get Batch Timeline
```http
GET http://localhost:8002/api/batches/BATCH_MONGO_ID/timeline
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "type": "status_change",
      "event": "Created",
      "timestamp": "2026-02-07T10:00:00.000Z",
      "location": "Farm, Tamil Nadu",
      "description": "Batch created"
    },
    {
      "type": "quality_check",
      "event": "Quality Check",
      "timestamp": "2026-02-07T11:00:00.000Z",
      "description": "curcumin_content: 5.2 %"
    },
    {
      "type": "status_change",
      "event": "In Transit",
      "timestamp": "2026-02-07T14:00:00.000Z",
      "location": "Highway 44, Chennai",
      "description": "Status changed to In Transit"
    }
  ],
  "message": "Timeline fetched",
  "success": true
}
```

---

### Get QR Code
```http
GET http://localhost:8002/api/batches/BATCH_MONGO_ID/qr
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "batchId": "BATCH-1707312000000-ABCD1234",
    "verifyUrl": "https://traceroot.app/verify/BATCH-1707312000000-ABCD1234"
  },
  "message": "QR code generated",
  "success": true
}
```

---

### Public: Verify Batch
```http
GET http://localhost:8002/api/public/batch/BATCH-1707312000000-ABCD1234
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "batch": {
      "batchId": "BATCH-1707312000000-ABCD1234",
      "productName": "Organic Turmeric",
      "variety": "Erode",
      "origin": "Tamil Nadu, India",
      "status": "In Transit",
      "quality": "Premium"
    },
    "qualityMetrics": [
      {"metricType": "curcumin_content", "value": "5.2", "unit": "%"}
    ],
    "timeline": [...],
    "progress": 56,
    "verified": true
  },
  "message": "Batch verified",
  "success": true
}
```

---

### Public: Verify NFC Tag
```http
GET http://localhost:8002/api/public/verify/NFC-001
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "valid": true,
    "batchId": "BATCH-1707312000000-ABCD1234",
    "batchNumber": "TR-2026-312000",
    "productName": "Organic Turmeric",
    "status": "In Transit",
    "quality": "Premium",
    "progress": 56,
    "message": "NFC tag verified successfully"
  },
  "message": "NFC verified",
  "success": true
}
```

---

## 🏆 Certifications (Trace Service - Port 8002)

### Get Active Certifications (Public)
```http
GET http://localhost:8002/api/certifications/active
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "certifications": [
      {
        "_id": "65cert123",
        "name": "USDA Organic",
        "active": true,
        "issuingBody": "USDA",
        "certificateNumber": "ORG-2026-001",
        "expiryDate": "2027-02-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Active certifications fetched",
  "success": true
}
```

---

### Get All Certifications (Protected)
```http
GET http://localhost:8002/api/certifications?active=true&type=organic
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "certifications": [
      {
        "_id": "65cert123",
        "name": "USDA Organic",
        "active": true,
        "type": "organic",
        "issuedDate": "2026-01-01T00:00:00.000Z",
        "expiryDate": "2027-02-01T00:00:00.000Z",
        "issuingBody": "USDA",
        "certificateNumber": "ORG-2026-001",
        "documentUrl": "https://storage.example.com/certs/org-cert.pdf",
        "isExpired": false,
        "daysUntilExpiry": 390
      }
    ]
  },
  "message": "Certifications fetched",
  "success": true
}
```

---

### Create Certification (Admin/Manufacturer)
```http
POST http://localhost:8002/api/certifications
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "USDA Organic",
  "active": true,
  "issuedDate": "2026-01-01",
  "expiryDate": "2027-02-01",
  "issuingBody": "USDA",
  "certificateNumber": "ORG-2026-001",
  "type": "organic",
  "scope": "All turmeric products",
  "documentUrl": "https://storage.example.com/certs/org-cert.pdf"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65cert123def456",
    "name": "USDA Organic",
    "active": true,
    "type": "organic",
    "issuedDate": "2026-01-01T00:00:00.000Z",
    "expiryDate": "2027-02-01T00:00:00.000Z",
    "issuingBody": "USDA",
    "certificateNumber": "ORG-2026-001",
    "createdAt": "2026-02-07T12:00:00.000Z"
  },
  "message": "Certification created successfully",
  "success": true
}
```

---

### Update Certification (Admin/Manufacturer)
```http
PUT http://localhost:8002/api/certifications/CERT_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "active": false
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65cert123def456",
    "name": "USDA Organic",
    "active": false
  },
  "message": "Certification updated",
  "success": true
}
```

---

### Get Expiring Certifications (Protected)
```http
GET http://localhost:8002/api/certifications/expiring?days=30
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "certifications": [
      {
        "_id": "65cert789",
        "name": "Fair Trade",
        "expiryDate": "2026-03-01T00:00:00.000Z",
        "daysUntilExpiry": 22
      }
    ],
    "expiringWithinDays": 30
  },
  "message": "Expiring certifications fetched",
  "success": true
}
```

---

### Delete Certification (Admin Only)
```http
DELETE http://localhost:8002/api/certifications/CERT_ID
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Certification deleted",
  "success": true
}
```

---

## 🧪 Quality Metrics with Lab Reports

### Add Quality Metric with Lab Report (Manufacturer)
```http
POST http://localhost:8002/api/batches/BATCH_MONGO_ID/quality
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "category": "Curcumin Content Analysis",
  "score": 95,
  "status": "Certified",
  "metricType": "curcumin_content",
  "value": "5.2",
  "unit": "%",
  "notes": "Excellent quality - exceeds standard",
  "labName": "Bureau Veritas",
  "testMethod": "HPLC",
  "reportNumber": "BV-2026-0157",
  "reportUrl": "https://storage.example.com/reports/BV-2026-0157.pdf",
  "testDate": "2026-02-05"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65qm123xyz",
    "batchId": "65abc123def456789",
    "category": "Curcumin Content Analysis",
    "score": 95,
    "status": "Certified",
    "metricType": "curcumin_content",
    "value": "5.2",
    "unit": "%",
    "notes": "Excellent quality - exceeds standard",
    "labName": "Bureau Veritas",
    "testMethod": "HPLC",
    "reportNumber": "BV-2026-0157",
    "reportUrl": "https://storage.example.com/reports/BV-2026-0157.pdf",
    "testDate": "2026-02-05T00:00:00.000Z",
    "inspectorId": "65inspector123",
    "createdAt": "2026-02-07T12:30:00.000Z"
  },
  "message": "Quality metric added",
  "success": true
}
```

---

## 🔗 Blockchain Service (Port 8003)

### Get Blockchain Status
```http
GET http://localhost:8003/api/blockchain/status
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "initialized": true,
    "connected": true,
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "balance": "99.5",
    "gasPrice": {
      "gasPrice": "20",
      "maxFeePerGas": null
    },
    "totalBatches": 15,
    "contracts": {
      "batchTracking": "0xabcdef1234567890abcdef1234567890abcdef12",
      "supplyChainStatus": "0x1234567890abcdef1234567890abcdef12345678"
    }
  },
  "message": "Blockchain status retrieved",
  "success": true
}
```

---

### Record Batch on Blockchain
```http
POST http://localhost:8003/api/blockchain/batch
Content-Type: application/json

{
  "batchId": "BATCH-1707312000000-ABCD1234",
  "productName": "Organic Turmeric",
  "variety": "Erode",
  "quantity": 1000,
  "unit": "kg",
  "location": "Tamil Nadu, India",
  "harvestDate": "2026-02-01T00:00:00Z",
  "expiryDate": "2027-02-01T00:00:00Z",
  "nfcTagId": "NFC-001"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "blockNumber": 12345,
    "gasUsed": "250000"
  },
  "message": "Batch recorded on blockchain",
  "success": true
}
```

---

### Verify NFC on Blockchain
```http
POST http://localhost:8003/api/blockchain/verify-nfc
Content-Type: application/json

{
  "batchId": "BATCH-1707312000000-ABCD1234",
  "nfcTagId": "NFC-001",
  "location": "Retail Store, Mumbai"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "txHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "blockNumber": 12346,
    "isValid": true
  },
  "message": "NFC verification completed",
  "success": true
}
```

---

### Get Batch from Blockchain
```http
GET http://localhost:8003/api/blockchain/batch/BATCH-1707312000000-ABCD1234
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "productName": "Organic Turmeric",
    "variety": "Erode",
    "quantity": 1000,
    "unit": "kg",
    "location": "Tamil Nadu, India",
    "harvestDate": "2026-02-01T00:00:00.000Z",
    "expiryDate": "2027-02-01T00:00:00.000Z",
    "nfcTagId": "NFC-001",
    "creator": "0x1234567890abcdef1234567890abcdef12345678",
    "timestamp": "2026-02-07T12:00:00.000Z"
  },
  "message": "Batch retrieved from blockchain",
  "success": true
}
```

---

### Get Transaction Status
```http
GET http://localhost:8003/api/blockchain/tx/0x1234567890abcdef...
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "hash": "0x1234567890abcdef...",
    "from": "0x1234567890abcdef1234567890abcdef12345678",
    "to": "0xabcdef1234567890abcdef1234567890abcdef12",
    "value": "0",
    "blockNumber": 12345,
    "status": "success",
    "gasUsed": "250000"
  },
  "message": "Transaction status retrieved",
  "success": true
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Batch ID and product name are required",
  "success": false
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "success": false
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: manufacturer",
  "success": false
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Batch not found",
  "success": false
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "success": false
}
```

### 500 Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "success": false
}
```

---

## 📝 Role-Based Access

| Action | supplier | manufacturer | distributor | retailer | admin |
|--------|:--------:|:------------:|:-----------:|:--------:|:-----:|
| Create Batch | ✅ | ❌ | ❌ | ❌ | ✅ |
| Add Quality | ❌ | ✅ | ❌ | ❌ | ✅ |
| Update Shipping | ❌ | ❌ | ✅ | ❌ | ✅ |
| Mark Delivered | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## ⚠️ Prerequisites

1. **MongoDB** running on `localhost:27017`
2. **Ganache** running on `localhost:8545`
3. All services running:
   ```bash
   cd server/auth-service && npm run dev
   cd server/trace-service && npm run dev
   cd server/blockchain-service && npm run dev
   ```
