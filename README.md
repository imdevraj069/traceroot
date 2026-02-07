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
- ✅ **Complete traceability** from farm to consumer

---

## 🏗️ Project Structure

```
traceroot/
│
├── client/                       # 🌐 Web Frontend (Next.js)
│   ├── app/                      # App router pages
│   ├── components/               # Reusable UI components
│   └── lib/                      # Utilities & API clients
│
├── mobile/                       # 📱 Mobile App (Flutter)
│   ├── lib/                      # Dart source code
│   ├── android/                  # Android platform files
│   └── ios/                      # iOS platform files
│
├── server/                       # ⚙️ Backend Microservices
│   ├── auth-service/             # 🔐 Authentication & Users
│   ├── trace-service/            # 📦 Batch & Supply Chain
│   ├── blockchain-service/       # 🔗 Ethereum Interactions
│   └── gateway/                  # 🚪 API Gateway (optional)
│
├── contracts/                    # 📜 Solidity Smart Contracts
│   ├── BatchTracking.sol         # Main supply chain contract
│   └── migrations/               # Truffle deployment scripts
│
├── shared/                       # 🔄 Shared Code & Types
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Common utilities
│
├── docs/                         # 📚 Documentation
│   ├── api/                      # API documentation
│   ├── architecture/             # System design docs
│   └── guides/                   # Setup & usage guides
│
├── scripts/                      # 🛠️ Automation Scripts
│   ├── deploy.sh                 # Deployment scripts
│   └── setup.sh                  # Initial setup
│
├── docker-compose.yml            # 🐳 Container orchestration
├── plan.md                       # 📋 Development roadmap
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Ethereum, Solidity 0.8, Truffle, Ganache |
| **Mobile** | Flutter 3.0+, Dart, web3dart, NFC Manager |
| **Web** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express 5 (Microservices) |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT, bcrypt |
| **DevOps** | Docker, Docker Compose |

---

## 🧩 Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Apps (Web / Mobile)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  API Gateway  │  (Optional)
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│ Auth Service  │   │ Trace Service │   │  Blockchain   │
│  :3001        │   │   :3002       │   │   Service     │
│               │   │               │   │   :3003       │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│   MongoDB     │   │   MongoDB     │   │   Ethereum    │
│  (Users)      │   │  (Batches)    │   │   Network     │
└───────────────┘   └───────────────┘   └───────────────┘
```

| Service | Port | Responsibility |
|---------|------|----------------|
| **auth-service** | 3001 | User registration, login, JWT, roles |
| **trace-service** | 3002 | Batch CRUD, supply chain events, quality metrics |
| **blockchain-service** | 3003 | Smart contract calls, on-chain verification |
| **gateway** | 3000 | Request routing, rate limiting (optional) |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Blockchain Immutability** | Batch records stored permanently on Ethereum |
| 📱 **NFC Authentication** | Physical products linked to blockchain via NFC tags |
| 🔄 **Dual Verification** | Cross-verify MongoDB (speed) + Blockchain (trust) |
| 📊 **Quality Tracking** | On-chain quality metrics with inspector proof |
| 📲 **QR Verification** | Public product verification without login |
| 🧩 **Scalable Architecture** | Independent microservices for flexibility |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Farmer** | Create batches, attach NFC tags, generate QR codes |
| **Inspector** | Record quality metrics, certify batches |
| **Distributor** | Verify products, track shipments |
| **Consumer** | View product origin, journey, and quality data |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Flutter 3.0+
- Ganache
- Docker (optional)

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/traceroot.git
cd traceroot
```

### 2. Start Services
```bash
# Start MongoDB & Ganache
docker-compose up -d mongo ganache

# Deploy contracts
cd contracts && npx truffle migrate --reset

# Start microservices
cd server/auth-service && npm run dev
cd server/trace-service && npm run dev
cd server/blockchain-service && npm run dev

# Start client
cd client && npm run dev

# Start mobile (on device/emulator)
cd mobile && flutter run
```

---

## 📜 License

MIT License

---

<div align="center">

**TraceRoot — Tracing your food back to its roots. 🌱**

</div>
