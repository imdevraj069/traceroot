# ✅ TESTING CHECKLIST - CHECK OFF AS YOU GO

## 🎯 Part 3: RBAC Testing (Current)

### Create Test Accounts
- [ ] Login to http://localhost:3001 as admin
- [ ] Create Supplier account (supplier@test.com)
- [ ] Create Manufacturer account (manufacturer@test.com)
- [ ] Create Distributor account (distributor@test.com)
- [ ] Create Retailer account (retailer@test.com)

### Verify Admin Permissions
Login as admin@test.com:
- [ ] See "New Batch" button on /batches
- [ ] See "Add Quality Metric" button on batch detail
- [ ] See "Add Certification" in More Actions
- [ ] See "Update Batch Status" component (all statuses)
- [ ] See "Edit Batch" option
- [ ] See "Delete Batch" option
- [ ] Can access /users page

### Verify Supplier Permissions
Login as supplier@test.com:
- [ ] See "New Batch" button
- [ ] Cannot see "Add Quality Metric" button
- [ ] Cannot see "Add Certification"
- [ ] Cannot see "Update Status"
- [ ] Cannot access /users page

### Verify Manufacturer Permissions
Login as manufacturer@test.com:
- [ ] Cannot see "New Batch" button
- [ ] See "Add Quality Metric" button
- [ ] See "Add Certification" option
- [ ] Cannot see "Update Status" button
- [ ] Cannot see "Delete Batch" option

### Verify Distributor Permissions
Login as distributor@test.com:
- [ ] Cannot see "New Batch" button
- [ ] Cannot see "Add Quality Metric" button
- [ ] See "Update Batch Status" button
- [ ] Status dropdown shows: **In Transit, In Distribution, Delivered** ONLY
- [ ] Cannot see other status options

### Verify Retailer Permissions
Login as retailer@test.com:
- [ ] Cannot see "New Batch" button
- [ ] Cannot see "Add Quality Metric" button
- [ ] See "Update Batch Status" button
- [ ] Status dropdown shows: **Delivered, Completed** ONLY
- [ ] Cannot see other status options

### Create First Batch & Verify Blockchain
Login as admin@test.com:
- [ ] Go to /batches page
- [ ] Click "New Batch"
- [ ] Fill: Product="Test Product", Quantity=100, Unit=kg, Origin="Test Location"
- [ ] Click "Create Batch"
- [ ] Batch appears in list
- [ ] Open Ganache Desktop UI
- [ ] Go to TRANSACTIONS tab
- [ ] **NEW TRANSACTION appears within 2-5 seconds** ✨
- [ ] Transaction shows: From=0x3080..., To=0x0AfE...

**✅ Part 3 Complete** → Move to Part 4-5

---

## 📦 Part 4-5: Batch CRUD & Details (When ready)

### Create Additional Batches
- [ ] Create as Admin: "Orange Juice", 500 units
- [ ] Create as Admin: "Coffee Beans", 1000 units
- [ ] Create as Supplier: "Cocoa Powder", 200 units

### Verify Batch Details Page
For first batch:
- [ ] Click on batch name → goes to detail page
- [ ] Product details shown (name, variety, quantity)
- [ ] Logistics card shown (origin, location)
- [ ] Identifiers shown (batch IDs, NFC tag)

### Verify Timeline Tab
- [ ] Click "Timeline" tab
- [ ] Shows "Batch Created" event
- [ ] Timestamp displayed
- [ ] Location = origin location

### Verify Quality Tab
- [ ] Click "Quality" tab
- [ ] Initially shows "No quality reports"

### Verify Documents Tab
- [ ] Click "Documents" tab
- [ ] Initially shows "No documents"

### Edit Batch (Admin Only)
- [ ] As Admin: Click "More Actions" → "Edit Batch"
- [ ] Change quantity to 550
- [ ] Add expiry date: 2027-01-01
- [ ] Click Save
- [ ] Verify changes on detail page

### Edit Batch Denied (Non-Admin)
- [ ] As Supplier: Go to batch detail
- [ ] Try to click "Edit Batch"
- [ ] See red "Access Denied" card
- [ ] Says "Only Admin role can edit"

### Delete Batch (Admin Only)
- [ ] As Admin: Click "More Actions" → "Delete Batch"
- [ ] See confirmation dialog
- [ ] Click Delete
- [ ] Batch removed from list

**✅ Part 4-5 Complete** → Move to Part 6-7

---

## 📊 Part 6-7: Quality Metrics & Status (When ready)

### Add Quality Metric (Manufacturer)
- [ ] As Manufacturer: Go to batch detail
- [ ] Click "Add Quality Metric"
- [ ] Fill: Type="pH Level", Score=7, Unit="pH", Status="Passed"
- [ ] Click Submit
- [ ] See success message
- [ ] Metric appears on Quality tab
- [ ] Open Ganache → **NEW TRANSACTION appears**

### Verify Timeline Update
- [ ] Go to Timeline tab
- [ ] New "Quality Check" event appears
- [ ] Description shows: "pH Level: Score 7/100 - Passed"

### Update Status (Distributor)
- [ ] As Distributor: Go to batch detail
- [ ] Find "Update Batch Status"
- [ ] Change to "In Transit"
- [ ] Add location: "Distribution Hub"
- [ ] Click "Update Status"
- [ ] See success message
- [ ] Status badge updates in header
- [ ] Open Ganache → **NEW TRANSACTION appears**

### Verify Status Timeline
- [ ] Go to Timeline tab
- [ ] New status change event appears
- [ ] Shows "In Transit" with location

### Test Status Limitations
- [ ] As Distributor: Try to update status again
- [ ] Can only select: In Transit, In Distribution, Delivered
- [ ] Cannot select: Created, Packaged, etc.
- [ ] As Retailer: Can only select: Delivered, Completed

**✅ Part 6-7 Complete** → Move to Part 8-9

---

## 📜 Part 8-9: Certifications & Access (When ready)

### Add Certification (Admin)
- [ ] As Admin: Go to batch detail
- [ ] Click "More Actions" → "Add Certification"
- [ ] Fill: Name="Organic Cert", Type="organic", Issuing Body="USDA"
- [ ] Fill: Issued Date=2026-01-01, Certificate Number="CERT-001"
- [ ] Click Submit
- [ ] See success message

### Certification Access Denied
- [ ] As Distributor: Go to batch detail
- [ ] Try to click "Add Certification"
- [ ] See red "Access Denied" card
- [ ] Says "Only Admin and Manufacturer can add certifications"

### Add Certification (Manufacturer)
- [ ] As Manufacturer: Go to batch detail
- [ ] Click "More Actions" → "Add Certification"
- [ ] Fill: Name="Quality Cert", Type="quality", Issuing Body="Lab"
- [ ] Click Submit
- [ ] See success message

**✅ Part 8-9 Complete** → Move to Part 10-12

---

## 🎨 Part 10-12: UI/UX Validation (When ready)

### Form Validation
- [ ] Create Batch dialog
- [ ] Try submit empty → See error "Product Name required"
- [ ] Enter negative quantity → See error
- [ ] Enter all required fields → Submit succeeds

### Dropdown Transparency Fix
- [ ] Create Batch dialog
- [ ] Click "Unit" dropdown
- [ ] Dropdown opens with white background ✅ (NOT transparent)
- [ ] Click on option → Changes value
- [ ] Option selected correctly

### Success Messages
- [ ] Create batch successfully
- [ ] See green success message
- [ ] Message auto-closes after ~1.5 seconds

### Error Messages
- [ ] Try invalid input
- [ ] See red error message with details
- [ ] Error stays until form corrected

### Loading States
- [ ] Click "Create Batch"
- [ ] During submission: Button shows "Creating..."
- [ ] Button disabled (cannot click again)
- [ ] After submission: Button returns to normal

### Table Loading
- [ ] Go to /batches
- [ ] Initially shows loading spinner
- [ ] Wait for data to load
- [ ] Table displays correctly

**✅ Part 10-12 Complete** → All testing finished!

---

## 🎉 FINAL VERIFICATION

When all checkboxes above are checked:
- ✅ RBAC working across all roles
- ✅ Batches create Ganache transactions
- ✅ Quality metrics create transactions
- ✅ Status updates create transactions
- ✅ Timeline shows all events
- ✅ Certifications working
- ✅ UI elements functional
- ✅ Access controls enforced
- ✅ **System is production-ready!**

---

## 📝 Notes While Testing

Use this space to write observations:

```
Session Date: _____________

Admin Test Notes:
_________________

Supplier Test Notes:
_________________

Manufacturer Test Notes:
_________________

Distributor Test Notes:
_________________

Retailer Test Notes:
_________________

Issues Found:
_________________

Blockchain Transactions Verified:
_________________
```

---

**Ready? Go to http://localhost:3001 and start checking! ✅**
