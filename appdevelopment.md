# Flutter Mobile App Development Plan

## 📱 Overview
The TraceRoot mobile application serves two primary user groups:
1.  **Supply Chain Actors** (Farmers, Manufacturers, Distributors, Retailers): To manage batches, update status, and scan items in the field/warehouse.
2.  **Consumers**: To verify product authenticity and view the supply chain journey via QR/NFC scanning.

## 🛠 Tech Stack
-   **Framework**: Flutter (Dart)
-   **State Management**: Riverpod (recommended) or BLoC
-   **Navigation**: GoRouter
-   **Networking**: Dio (with interceptors for JWT)
-   **Storage**: Flutter Secure Storage (for tokens), Hive/SharedPreferences (for improved UX/caching)
-   **UI Components**: Material 3 / Cupertino (adaptive)
-   **Features**:
    -   `mobile_scanner` (QR Code scanning)
    -   `nfc_manager` (NFC reading/writing)
    -   `geolocator` (GPS coordinates for status updates)
    -   `camera` (Evidence/media uploads)

## 🏗 Architecture
We will follow a **Clean Architecture** approach with **Feature-first** directory structure:

```
lib/
├── main.dart
├── core/
│   ├── config/              # Env vars, theme
│   ├── constants/           # API endpoints, assets
│   ├── network/             # Dio client, interceptors
│   ├── router/              # GoRouter config
│   └── utils/               # Helpers, validators
├── features/
│   ├── auth/                # Login, Profile
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── batches/             # CRUD, List, Detail
│   ├── scanner/             # QR/NFC Logic
│   └── verification/        # Public verify view
└── shared/
    ├── widgets/             # Reusable UI components
    └── models/              # Common data models
```

## 📝 Features & Modules

### 1. Authentication (Auth Service - Port 8001)
-   **Login Screen**: Email/Password.
-   **Role Handling**: Store JWT in Secure Storage. Decode token to adapt UI based on role (`admin`, `supplier`, `distributor`, etc.).
-   **Profile**: View user details / Logout.

### 2. Dashboard (Role-Based)
-   **Supplier (Farmer)**: "My Batches", "Create Batch", "Recent Activity".
-   **Distributor/Manufacturer**: "Incoming Batches", "Scan to Receive", "Update Status".
-   **Consumer (Public)**: "Scan Product", "History", "About TraceRoot".
-   **Widgets**: Summary stats (Active Batches, pending actions).

### 3. Scanner Module
-   **QR Scanner**:
    -   For **Consumers**: Redirects to Verification Screen.
    -   For **Actors**: Opens Batch Detail / Update Status screen.
-   **NFC Reader**:
    -   Reads Tag ID.
    -   Verifies authenticity against Blockchain/Trace Service.

### 4. Batch Management (Trace Service - Port 8002)
-   **List View**: Infinite scroll list of batches with status chips.
-   **Detail View**:
    -   Tabs: Overview, Timeline, Quality, Documents.
    -   Map View: Visualize current location (if coords available).
-   **Actions**:
    -   **Create Batch** (Supplier only): Multi-step form.
    -   **Update Status**: Dropdown for status change + Location (GPS) + Optional Note.
    -   **Add Quality Metric**: Form for submitting lab results.

### 5. Verification View (Consumer)
-   **Timeline**: Vertical step indicator showing the journey.
-   **Map**: Origin to Destination visualization.
-   **Authenticity Badge**: Green checkmark if valid on Blockchain.

## 🔗 API Integration Strategy

### Base URLs (Configurable via `.env`)
-   `AUTH_URL`: `http://<HOST_IP>:8001/api/auth`
-   `TRACE_URL`: `http://<HOST_IP>:8002/api`

### Endpoints Mapping
| Feature | Method | Endpoint | Note |
|:---|:---|:---|:---|
| **Auth** | POST | `/login` | Get Access/Refresh Tokens |
| | GET | `/profile` | Get User Role |
| **Batches** | GET | `/batches` | Filter by user/role |
| | POST | `/batches` | Create new batch |
| | GET | `/batches/:id` | Get details |
| | PUT | `/batches/:id/status` | Update status (Geo-tagged) |
| | GET | `/public/batch/:id` | Public verification |
| **Certifications** | GET | `/certifications` | List available certs |

## 🎨 Design System
-   **Colors**: Match Web Admin (Green/Emerald primary, Slate grays).
-   **Typography**: Inter or Roboto.
-   **Components**: Cards for batches, Chips for status, Bottom Sheet for quick actions.

## 📅 Phases

### Phase 5.1: Setup & Foundation
-   Initialize Flutter project.
-   Setup flavors (dev, prod).
-   Implement Dio client & Auth Repository.

### Phase 5.2: Auth & Navigation
-   Login UI & Logic.
-   Role-based routing guard.
-   Persistent session management.

### Phase 5.3: Core Features (Actors)
-   Batch List & Detail UI.
-   Create Batch Form.
-   Update Status Logic.

### Phase 5.4: Hardware Integration
-   Camera/QR implementation.
-   NFC implementation.
-   GPS Location service.

### Phase 5.5: Consumer View & Polish
-   Public verification page (unauthenticated).
-   Polishing UI/Animations.
-   Build APK/IPA.
