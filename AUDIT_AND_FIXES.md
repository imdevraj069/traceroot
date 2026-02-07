# COMPREHENSIVE ADMIN PANEL AUDIT - Issues & Fixes

## 1. TIMELINE ISSUE (CRITICAL) ✗
**Location**: `server/trace-service/src/services/batch.service.js` (Line 177-215)
**Problem**: Quality metrics timeline uses wrong fields
- Using: `metric.value` and `metric.unit` (legacy/removed fields)
- Should use: `metric.metricType` and `metric.score` (actual stored fields)

**Current Code**:
```javascript
description: `${metric.metricType}: ${metric.value} ${metric.unit || ''}`
```

**Should Be**:
```javascript
description: `${metric.metricType}: Score ${metric.score}/100 - ${metric.status}`
```

**Also Add**: Batch creation event to timeline
```javascript
timeline.push({
    type: 'batch_created',
    event: 'Batch Created',
    timestamp: batch.createdAt,
    location: batch.origin,
    description: `${batch.productName} batch created with quantity ${batch.quantity} ${batch.unit}`
});
```

---

## 2. CERTIFICATION FORM ISSUES (MAJOR) ✗
**Location**: `client/admin/src/components/CertificationForm.tsx`

### Issue 2a: Wrong API Endpoint
- Current: `batches.addCertification(batchId, ...)` calls `/api/batches/:id/certifications`
- Problem: This endpoint doesn't exist in server
- Fix: Use `certifications.create(...)` which calls `/api/certifications`
- Status: Code updated but JSX form fields still need update

### Issue 2b: Missing Role-Based Access
- Current: No role check
- Should only allow: `admin` and `manufacturer`
- Status: Access control added ✓

### Issue 2c: Wrong Field Names
**Old Schema**:
```
- issueDate → issuedDate
- issuingAuthority → issuingBody
- Missing: type field
- Missing: documentUrl field
```

**Server Expected Schema**:
- name (string, required)
- type (enum: organic, quality, safety, environmental, social, other)
- issuingBody (string)
- issuedDate (date)
- expiryDate (date, optional)
- certificateNumber (string, optional)
- documentUrl (string, optional)

### Issue 2d: Form JSX Structure
- Old field names still in JSX (issueDate, issuingAuthority)
- Missing type select dropdown
- Missing documentUrl input
- Placeholder says "Record certification for batch" but it's global, not batch-specific

**Fix Applied**: Updated form schema ✓
**Still Needed**: Update form JSX fields to match new schema

---

## 3. EDIT BATCH FORM - NO ROLE CHECK (MAJOR) ✗
**Location**: `client/admin/src/components/EditBatchForm.tsx`

**Problem**: No role-based access control
- Should only allow: `admin` role (or batch creator)
- Current: Anyone can edit any batch

**Fix**: Add role check like in other forms:
```typescript
const { user } = useAuthStore()
const canEditBatch = user?.role === 'admin'

if (!canEditBatch) {
    return <Card className="border-red-200 bg-red-50">...</Card>
}
```

---

## 4. API ENDPOINT MAPPING ISSUES
**File**: `client/admin/src/lib/api.ts`

### Current Calls:
```typescript
addCertification: (id, data) => `/api/batches/${id}/certifications` ✗ WRONG
```

### Should Be:
Certifications are global, not batch-specific. Client should call:
```typescript
certifications.create(data) → `/api/certifications` ✓
```

The batch detail page calls `batches.addCertification(batchId, ...)` which is incorrect.

---

## 5. DATA FLOW VERIFICATION

### CreateBatchDialog ✓
- Fields: productName, variety, quantity, unit, origin, harvestDate, nfcTagId
- Endpoint: POST /api/batches
- Role: Supplier, Admin ✓
- Validation: ✓
- Error handling: ✓

### QualityMetricsForm ✓
- Fields: metricType, score, category, status, unit, labName, testMethod, reportNumber, notes
- Endpoint: POST /api/batches/:id/quality
- Role: Admin, Manufacturer ✓
- Validation: ✓
- Server match: ✓

### CertificationForm ⚠️
- Wrong endpoint (batch-specific vs global)
- Fields mapped incorrectly
- Form JSX outdated
- Role-based access added ✓

### EditBatchForm ⚠️
- No role-based access
- Fields: productName, variety, quantity, unit, origin, harvestDate, expiryDate
- Endpoint: PUT /api/batches/:id
- Validation: ✓

### BatchStatusUpdate ✓
- Fields: status, location, notes
- Endpoint: PUT /api/batches/:id/status
- Role: Admin, Distributor, Retailer ✓
- Status options filtered by role ✓

---

## 6. ROLE-BASED ACCESS SUMMARY

### Admin Role:
- ✓ Create Batch
- ✓ Edit Batch
- ✓ Add Quality Metric
- ✓ Add Certification
- ✓ Update Status (all statuses available)

### Supplier Role:
- ✓ Create Batch
- ✗ Edit Batch
- ✗ Add Quality Metric
- ✗ Add Certification
- ✗ Update Status

### Manufacturer Role:
- ✗ Create Batch
- ✗ Edit Batch
- ✓ Add Quality Metric
- ✓ Add Certification
- ✗ Update Status

### Distributor Role:
- ✗ Create Batch
- ✗ Edit Batch
- ✗ Add Quality Metric
- ✗ Add Certification
- ✓ Update Status (Transit, Distribution, Delivered)

### Retailer Role:
- ✗ Create Batch
- ✗ Edit Batch
- ✗ Add Quality Metric
- ✗ Add Certification
- ✓ Update Status (Delivered, Completed)

---

## PRIORITY FIXES

### CRITICAL (Block User):
1. [ ] Fix timeline metric.value → metric.score mapping in server
2. [ ] Remove batch-specific certification endpoint logic
3. [ ] Fix CertificationForm JSX to match new schema

### HIGH (Missing Features):
4. [ ] Add role-based access to EditBatchForm
5. [ ] Update certification API client to use global endpoint
6. [ ] Fix batch detail page certification form submission

### MEDIUM (Quality):
7. [ ] Add error messages to all forms
8. [ ] Add success notifications
9. [ ] Maintain form state after errors

---

## TESTING CHECKLIST

- [ ] Create Batch (Supplier) - Success
- [ ] Update Batch (Admin only) - Check role block
- [ ] Add Quality Metric (Manufacturer) - Success
- [ ] View Timeline - Shows creation, status updates, quality checks in correct order
- [ ] Add Certification (Admin) - Success  
- [ ] Update Status (Distributor) - Limited statuses shown
- [ ] Check all dialogs close on success
- [ ] Check all error messages display
