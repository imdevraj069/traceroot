# 🌱 TraceRoot

**Blockchain-Powered Supply Chain Traceability for Agricultural Products**

[![Web App](https://img.shields.io/badge/Web_App-Live-4CAF50?style=for-the-badge)](https://traceroot.web.app/)
[![Download APK](https://img.shields.io/badge/Android_APK-Download-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://drive.google.com/file/d/1kcqHzCqv5-D2LRwWCQ4_Zx0AEs2_ZWIq/view?usp=sharing)

---

## 📋 What is TraceRoot?

TraceRoot is an end-to-end supply chain management system that uses **Ethereum blockchain**, **MongoDB**, and **NFC/QR technology** to provide:

- ✅ **Tamper-proof batch records** on the blockchain
- ✅ **Microservices-based backend** for scalability
- ✅ **NFC tag authentication** for anti-counterfeiting
- ✅ **Public verification** via QR codes
- ✅ **Lab test reports & certifications** tracking
- ✅ **Complete traceability** from farm to consumer

---

## 🏗️ Project Structure

```
traceroot/
│
├── contracts/                    # 📜 Solidity Smart Contracts
│   ├── contracts/
│   │   ├── BatchTracking.sol     # Batch, quality, NFC tracking
│   │   ├── SupplyChainStatus.sol # Status updates & progress
│   │   └── Migrations.sol        # Truffle migrations
│   ├── migrations/               # Deployment scripts
│   ├── test/                     # Contract tests
│   └── truffle-config.js         # Truffle configuration
│
├── server/                       # ⚙️ Backend Microservices
│   ├── auth-service/             # 🔐 Port 3001
│   │   ├── models/               # User, RefreshToken, PasswordReset
│   │   ├── services/             # Auth, Email
│   │   ├── middlewares/          # JWT, RBAC
│   │   └── templates/            # Email templates
│   │
│   ├── trace-service/            # 📦 Port 3002
│   │   ├── models/               # Batch, QualityMetric, Certification, StatusHistory
│   │   ├── services/             # Batch, Certification, QR
│   │   └── middlewares/          # Auth, RBAC
│   │
│   └── blockchain-service/       # 🔗 Port 3003
│       ├── services/             # Blockchain (ethers.js)
│       └── contracts/            # Contract ABIs
│
├── client/                       # 🌐 Web Frontend (Next.js) - TODO
├── mobile/                       # 📱 Mobile App (Flutter) - TODO
│
├── API_TESTING.md                # API testing guide with examples
├── PROGRESS.md                   # Development progress tracker
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Ethereum, Solidity 0.8.19, Truffle, Ganache |
| **Backend** | Node.js, Express 5 (ES Modules, Microservices) |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (access + refresh), bcrypt, RBAC |
| **Web** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Mobile** | Flutter 3.0+, Dart, web3dart, NFC Manager |
| **DevOps** | Docker, Docker Compose |

---

## 🧩 Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Apps (Web / Mobile)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│ Auth Service  │   │ Trace Service │   │  Blockchain   │
│    :3001      │   │    :3002      │   │   Service     │
│               │   │               │   │    :3003      │
│ • JWT Auth    │   │ • Batches     │   │ • Contract    │
│ • RBAC        │   │ • Quality     │   │   Calls       │
│ • Emails      │   │ • Certs       │   │ • Wallet      │
│ • Refresh     │   │ • QR/NFC      │   │ • Gas Est.    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│   MongoDB     │   │   MongoDB     │   │   Ethereum    │
│  (Users)      │   │  (Batches)    │   │   Network     │
└───────────────┘   └───────────────┘   └───────────────┘
```

| Service | Port | Responsibility |
|---------|------|----------------|
| **auth-service** | 3001 | User registration, login, JWT, RBAC, password reset, emails |
| **trace-service** | 3002 | Batches, quality metrics, lab reports, certifications, QR codes |
| **blockchain-service** | 3003 | Smart contract calls, NFC verification, on-chain records |

---

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | System administrator | Full access to all features |
| `supplier` | Farmers/Producers | Create batches, attach NFC tags |
| `manufacturer` | Processing facilities | Add quality metrics, lab reports, certifications |
| `distributor` | Logistics & transport | Update shipping status, track shipments |
| `retailer` | End sellers | Mark batches as delivered |
| `user` | Public consumers | View/verify product info (read-only) |

---

## 📦 Supply Chain Status Flow

```
Created → Harvested → Processing → Quality Check → Packaged → In Transit → In Distribution → Delivered → Completed
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Blockchain Immutability** | Batch records stored permanently on Ethereum |
| 📱 **NFC Authentication** | Physical products linked to blockchain via NFC tags |
| 🔄 **Dual Verification** | Cross-verify MongoDB (speed) + Blockchain (trust) |
| 📊 **Quality & Lab Reports** | On-chain quality metrics with lab test details |
| 🏆 **Certifications** | Track USDA Organic, Fair Trade, ISO certifications |
| 📲 **QR Verification** | Public product verification without login |
| 📧 **Email Notifications** | Welcome, password reset, status updates |
| 🧩 **Scalable Architecture** | Independent microservices |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (running on localhost:27017)
- Ganache (for local blockchain)
- Flutter 3.0+ (for mobile)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/traceroot.git
cd traceroot

# Install dependencies for each service
cd server/auth-service && npm install
cd ../trace-service && npm install
cd ../blockchain-service && npm install
cd ../../contracts && npm install
```

### 2. Deploy Smart Contracts
```bash
# Start Ganache
npx ganache --port 8545

# Deploy contracts
cd contracts
npm run deploy:local
npm run export:abi
```

### 3. Configure Environment
```bash
# Copy .env.local files in each service and configure:
# - MONGO_URI
# - JWT_SECRET
# - Blockchain contract addresses
```

### 4. Start Services
```bash
# Terminal 1: Auth Service
cd server/auth-service && npm run dev

# Terminal 2: Trace Service
cd server/trace-service && npm run dev

# Terminal 3: Blockchain Service
cd server/blockchain-service && npm run dev
```

### 5. Test APIs
See [API_TESTING.md](./API_TESTING.md) for complete API documentation with examples.

---

## 📁 Documentation

| File | Description |
|------|-------------|
| [PROGRESS.md](./PROGRESS.md) | Development progress tracker |
| [API_TESTING.md](./API_TESTING.md) | API endpoints with request/response examples |
| [contracts/README.md](./contracts/README.md) | Smart contract documentation |

---

## 📜 License

MIT License

---

<div align="center">

**TraceRoot — Tracing your food back to its roots. 🌱**

</div>
