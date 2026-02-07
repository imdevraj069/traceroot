# 🌱 TraceRoot - Features & System Design

## 📋 Table of Contents
- [Features](#-features)
- [User Roles](#-user-roles)
- [Authentication Flow](#-authentication-flow)
- [Authorization (RBAC)](#-authorization-rbac)
- [Data Flow](#-data-flow)

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Batch Management** | Create, track, and manage product batches through the supply chain |
| **Blockchain Recording** | Immutable on-chain storage of batch data on Ethereum |
| **NFC Authentication** | Link physical products to blockchain via NFC tags |
| **QR Code Verification** | Public product verification without login |
| **Quality Metrics** | Record temperature, pH, moisture, and custom metrics |
| **Supply Chain Timeline** | Visual journey from farm to consumer |

### Platform Features

| Feature | Web | Mobile |
|---------|:---:|:------:|
| User Authentication | ✅ | ✅ |
| Dashboard & Analytics | ✅ | ✅ |
| Batch Creation | ✅ | ✅ |
| Batch Viewing | ✅ | ✅ |
| QR Code Generation | ✅ | ✅ |
| QR Code Scanning | ❌ | ✅ |
| NFC Reading | ❌ | ✅ |
| Offline Mode | ❌ | ✅ |
| Public Verification | ✅ | ✅ |

---

## 👥 User Roles

### Role Definitions

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** | System administrator | Full access |
| **Farmer** | Product creator/harvester | Create batches, view own data |
| **Inspector** | Quality control officer | Add quality metrics, certify |
| **Distributor** | Logistics handler | Track shipments, verify products |
| **Consumer** | End user | View public batch data only |

### Role Permissions Matrix

| Action | Admin | Farmer | Inspector | Distributor | Consumer |
|--------|:-----:|:------:|:---------:|:-----------:|:--------:|
| Create Batch | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Own Batch | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Batch | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Batches | ✅ | ❌ | ✅ | ✅ | ❌ |
| View Own Batches | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add Quality Metrics | ✅ | ❌ | ✅ | ❌ | ❌ |
| Verify NFC | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Public Batch | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔐 Authentication Flow

### Registration Flow

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────┐
│  User   │────▶│ POST /register│────▶│  Validate │────▶│  Hash    │
│  Input  │     │              │     │  Input    │     │ Password │
└─────────┘     └──────────────┘     └───────────┘     └────┬─────┘
                                                            │
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌────▼─────┐
│  Done   │◀────│ Return JWT   │◀────│  Generate │◀────│  Save to │
│         │     │  + User      │     │   JWT     │     │  MongoDB │
└─────────┘     └──────────────┘     └───────────┘     └──────────┘
```

### Login Flow

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────┐
│  Email  │────▶│ POST /login  │────▶│  Find     │────▶│  Verify  │
│ Password│     │              │     │  User     │     │ Password │
└─────────┘     └──────────────┘     └───────────┘     └────┬─────┘
                                                            │
                ┌──────────────┐     ┌───────────┐     ┌────▼─────┐
                │ Return JWT   │◀────│  Generate │◀────│  Valid?  │
                │  + User      │     │   JWT     │     │   Yes    │
                └──────────────┘     └───────────┘     └──────────┘
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "64a1b2c3d4e5f6g7h8i9j0",
    "email": "user@example.com",
    "role": "farmer",
    "iat": 1700000000,
    "exp": 1700086400
  }
}
```

### Token Lifecycle

| Event | Action |
|-------|--------|
| Login | Issue access token (24h) + refresh token (7d) |
| API Request | Validate access token in header |
| Token Expired | Use refresh token to get new access token |
| Logout | Invalidate refresh token |

---

## 🛡️ Authorization (RBAC)

### Middleware Flow

```
┌──────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────┐
│  Request │────▶│  Extract     │────▶│  Verify   │────▶│  Decode  │
│  + JWT   │     │  Token       │     │  Token    │     │  Payload │
└──────────┘     └──────────────┘     └───────────┘     └────┬─────┘
                                                             │
┌──────────┐     ┌──────────────┐     ┌───────────┐     ┌────▼─────┐
│  Handle  │◀────│   Allowed?   │◀────│   Check   │◀────│  Get     │
│  Request │     │   Yes ✅     │     │   Role    │     │  Role    │
└──────────┘     └──────────────┘     └───────────┘     └──────────┘
```

### Route Protection Examples

```javascript
// Public route - no auth required
GET /api/public/batch/:batchId

// Authenticated route - any logged-in user
GET /api/batches
→ Middleware: requireAuth

// Role-restricted route - specific roles only
POST /api/batches
→ Middleware: requireAuth, requireRole(['admin', 'farmer'])

// Owner-only route - must own the resource
PUT /api/batches/:id
→ Middleware: requireAuth, requireOwner
```

### Error Responses

| Code | Scenario |
|------|----------|
| `401 Unauthorized` | Missing or invalid token |
| `403 Forbidden` | Valid token but insufficient permissions |
| `404 Not Found` | Resource doesn't exist or not accessible |

---

## 🔄 Data Flow

### 1. Batch Creation Flow

```
┌────────────┐
│   Farmer   │
│   (Web/    │
│   Mobile)  │
└─────┬──────┘
      │ POST /api/batches
      ▼
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Auth     │────▶│   Trace    │────▶│ Blockchain │
│  Service   │     │  Service   │     │  Service   │
│            │     │            │     │            │
│ Validate   │     │ Save to    │     │ Record on  │
│ JWT        │     │ MongoDB    │     │ Ethereum   │
└────────────┘     └─────┬──────┘     └─────┬──────┘
                         │                  │
                         ▼                  ▼
                   ┌───────────┐      ┌───────────┐
                   │  MongoDB  │      │ Ethereum  │
                   │ (Batches) │      │ Blockchain│
                   └───────────┘      └───────────┘
```

### 2. NFC Verification Flow

```
┌────────────┐
│  Consumer  │
│  (Mobile)  │
└─────┬──────┘
      │ Scan NFC Tag
      ▼
┌────────────┐
│    NFC     │
│  Manager   │
│ (Flutter)  │
└─────┬──────┘
      │ Read Tag ID
      ▼
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Trace    │────▶│ Blockchain │────▶│  Ethereum  │
│  Service   │     │  Service   │     │  Contract  │
│            │     │            │     │            │
│ Get Batch  │     │ Verify NFC │     │ Check Hash │
│ by NFC ID  │     │ on-chain   │     │ Immutable  │
└─────┬──────┘     └────────────┘     └────────────┘
      │
      ▼
┌────────────┐
│  Display   │
│  Product   │
│  Details   │
└────────────┘
```

### 3. Quality Metrics Flow

```
┌────────────┐
│  Inspector │
└─────┬──────┘
      │ POST /api/batches/:id/quality
      ▼
┌────────────┐     ┌────────────┐
│   Auth     │────▶│   Trace    │
│  Service   │     │  Service   │
│            │     │            │
│ Validate   │     │ Validate   │
│ Inspector  │     │ Batch      │
│ Role       │     │ Exists     │
└────────────┘     └─────┬──────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
    ┌────────────┐               ┌────────────┐
    │  MongoDB   │               │ Blockchain │
    │            │               │  Service   │
    │ Save       │               │            │
    │ Metrics    │               │ Record     │
    │            │               │ On-chain   │
    └────────────┘               └────────────┘
```

### 4. Public QR Verification Flow

```
┌────────────┐
│  Consumer  │
│ (Any User) │
└─────┬──────┘
      │ Scan QR Code
      ▼
┌────────────┐
│  QR Code   │
│  Contains  │
│  Batch ID  │
└─────┬──────┘
      │ GET /api/public/batch/:id
      ▼
┌────────────┐     ┌────────────┐
│   Trace    │────▶│ Blockchain │
│  Service   │     │  Service   │
│            │     │            │
│ Get Batch  │     │ Verify     │
│ (No Auth)  │     │ On-chain   │
└─────┬──────┘     └────────────┘
      │
      ▼
┌────────────────────────┐
│   Public Batch View    │
│                        │
│ • Product Name         │
│ • Origin Location      │
│ • Harvest Date         │
│ • Quality Metrics      │
│ • Supply Chain Journey │
│ • Blockchain TX Hash   │
└────────────────────────┘
```

---

## 📊 Data Models

### User Model
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string;      // bcrypt hashed
  name: string;
  role: 'admin' | 'farmer' | 'inspector' | 'distributor' | 'consumer';
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Batch Model
```typescript
interface Batch {
  _id: ObjectId;
  batchId: string;       // Unique identifier
  productName: string;
  variety: string;
  quantity: number;
  unit: string;
  location: string;
  harvestDate: Date;
  expiryDate: Date;
  nfcTagId: string;
  createdBy: ObjectId;   // User reference
  blockchainTxHash: string;
  status: 'created' | 'inspected' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}
```

### Quality Metric Model
```typescript
interface QualityMetric {
  _id: ObjectId;
  batchId: ObjectId;
  metricType: string;    // 'temperature', 'pH', 'moisture', etc.
  value: string;
  unit: string;
  inspectorId: ObjectId;
  blockchainTxHash: string;
  timestamp: Date;
}
```

---

*Last Updated: February 2026*
