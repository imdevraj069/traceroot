# Frontend Implementation Plan

## Overview
Build two Next.js applications with App Router and src directory structure:
1. **client/frontend** - Public-facing website for consumers to verify products
2. **client/admin** - Admin dashboard with charts, analytics, and management features

## Port Configuration

| Service | Port |
|---------|------|
| **Auth Service** | 8001 |
| **Trace Service** | 8002 |
| **Blockchain Service** | 8003 |
| **Frontend App** | 3001 |
| **Admin Dashboard** | 3002 |

---

## Tech Stack
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components (based on original repo) |
| Recharts | Charts and graphs for analytics |
| Lucide React | Icons |
| Axios | API calls |
| Zustand | State management |

---

## Directory Structure

```
client/
├── frontend/                    # Public consumer app (Port 3001)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── verify/
│   │   │   │   └── [batchId]/page.tsx  # Public batch verification
│   │   │   ├── scan/page.tsx   # QR/NFC scanner
│   │   │   └── about/page.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BatchVerification.tsx
│   │   │   └── SupplyChainTimeline.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       └── utils.ts
│
├── admin/                       # Admin dashboard (Port 3002)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard with charts
│   │   │   ├── login/page.tsx
│   │   │   ├── batches/
│   │   │   │   ├── page.tsx    # Batch list
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── analytics/page.tsx  # Charts & graphs
│   │   │   ├── quality/page.tsx
│   │   │   ├── certifications/page.tsx
│   │   │   ├── users/page.tsx  # User management (admin)
│   │   │   └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── charts/
│   │   │   │   ├── BatchStatusChart.tsx
│   │   │   │   ├── QualityTrendChart.tsx
│   │   │   │   ├── RegionalDistribution.tsx
│   │   │   │   └── SupplyChainProgress.tsx
│   │   │   ├── BatchTable.tsx
│   │   │   ├── CreateBatchDialog.tsx
│   │   │   └── QualityMetricsForm.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   └── store/
│   │       └── auth-store.ts
```

---

## Frontend App (Public Consumer Site - Port 3001)

### Pages
| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero section |
| `/verify/[batchId]` | Public batch verification |
| `/scan` | QR camera scanner |
| `/about` | About TraceRoot |

### Components
- `Header.tsx` - Navigation, branding
- `Footer.tsx` - Links, copyright
- `BatchVerification.tsx` - Display verified batch info
- `SupplyChainTimeline.tsx` - Visual journey timeline
- `QualityBadge.tsx` - Display certifications

---

## Admin Dashboard (Port 3002)

### Pages
| Route | Purpose |
|-------|---------|
| `/login` | Auth form |
| `/` | Dashboard with stats & charts |
| `/batches` | CRUD table with filters |
| `/batches/[id]` | Full batch info, edit |
| `/analytics` | Charts with Recharts |
| `/quality` | Quality metrics management |
| `/certifications` | Certification CRUD |
| `/users` | Admin: user management |
| `/settings` | Profile settings |

### Charts (Recharts)
| Chart | Purpose |
|-------|---------|
| `BatchStatusChart.tsx` | Pie/donut showing batch status distribution |
| `QualityTrendChart.tsx` | Line chart showing quality over time |
| `RegionalDistribution.tsx` | Bar chart by region |
| `SupplyChainProgress.tsx` | Progress visualization |
| `MonthlyBatchesChart.tsx` | Area chart for batch creation over time |

---

## API Integration

### Auth Service (Port 8001)
```
POST http://localhost:8001/api/auth/login
POST http://localhost:8001/api/auth/register
POST http://localhost:8001/api/auth/refresh
GET  http://localhost:8001/api/auth/profile
```

### Trace Service (Port 8002)
```
GET  http://localhost:8002/api/batches
POST http://localhost:8002/api/batches
GET  http://localhost:8002/api/batches/:id
PUT  http://localhost:8002/api/batches/:id/status
POST http://localhost:8002/api/batches/:id/quality
GET  http://localhost:8002/api/certifications
POST http://localhost:8002/api/certifications
GET  http://localhost:8002/api/public/batch/:batchId  (no auth)
```

### Blockchain Service (Port 8003)
```
POST http://localhost:8003/api/blockchain/batch
POST http://localhost:8003/api/blockchain/verify-nfc
GET  http://localhost:8003/api/blockchain/status
```
