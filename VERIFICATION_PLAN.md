# TraceRoot Admin Panel - Complete Verification Plan

## Overview
This document provides a systematic verification checklist for the entire admin panel system. Test each section progressively and mark items as you verify them.

---

## ✅ PART 1: SYSTEM STARTUP & CONNECTIVITY

### Services Running
- [ ] MongoDB running on port 27017
- [ ] Auth Service running on port 8001
- [ ] Trace Service running on port 8002
- [ ] Blockchain Service running on port 8003
- [ ] Ganache running on port 8545
- [ ] Admin Frontend running on port 3000

### Basic Health Checks
```bash
# Test each endpoint:
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/
curl http://localhost:3000
```
- [ ] Auth service responds
- [ ] Trace service responds
- [ ] Blockchain service responds
- [ ] Frontend loads

### Environment Variables
Check `client/admin/.env.local`:
- [ ] NEXT_PUBLIC_AUTH_URL=http://localhost:8001
- [ ] NEXT_PUBLIC_TRACE_URL=http://localhost:8002
- [ ] NEXT_PUBLIC_BLOCKCHAIN_URL=http://localhost:8003

### Blockchain Setup
- [ ] Ganache UI shows 10 accounts
- [ ] Ganache TRANSACTIONS tab shows 3 contract deployment transactions
- [ ] Ganache BLOCKS tab shows blocks 0-9+
- [ ] Ganache CONTRACTS tab shows BatchTracking and SupplyChainStatus contracts

---

## ✅ PART 2: AUTHENTICATION & USER MANAGEMENT

### Login Flow
- [ ] Navigate to http://localhost:3000
- [ ] Redirects to /login if not authenticated
- [ ] Login page renders correctly
- [ ] Login form has email and password fields

### Test Accounts (Create if needed)
Create test users with different roles:
- [ ] Admin user created (email: admin@test.com, password: admin123)
- [ ] Supplier user created (email: supplier@test.com, password: supplier123)
- [ ] Manufacturer user created (email: manufacturer@test.com, password: manufacturer123)
- [ ] Distributor user created (email: distributor@test.com, password: distributor123)
- [ ] Retailer user created (email: retailer@test.com, password: retailer123)

### Login Testing
- [ ] Can login with admin account
- [ ] Shows error with wrong password
- [ ] Shows error with non-existent email
- [ ] Redirects to /dashboard after successful login
- [ ] Token stored in localStorage
- [ ] Token stored in cookies

### Dashboard Access
- [ ] Dashboard loads after login
- [ ] Sidebar visible
- [ ] DashboardHeader shows user info
- [ ] Navigation links work (Dashboard, Batches, Users, etc.)

### Logout
- [ ] Logout button visible
- [ ] Clicking logout clears tokens
- [ ] Redirects to /login after logout
- [ ] Cannot access protected routes after logout

---

## ✅ PART 3: ROLE-BASED ACCESS CONTROL (RBAC)

### Admin Role Permissions
Login as admin@test.com:
- [ ] Can see "New Batch" button on /batches page
- [ ] Can see "Add Quality Metric" button on batch detail page
- [ ] Can see "Add Certification" menu item
- [ ] Can see "Delete Batch" menu item
- [ ] Can see "Edit Batch" button
- [ ] Can see "Update Batch Status" component with ALL statuses
- [ ] Can access /users page
- [ ] Can change user roles

### Supplier Role Permissions
Login as supplier@test.com:
- [ ] Can see "New Batch" button on /batches page
- [ ] CANNOT see "Add Quality Metric" button
- [ ] CANNOT see "Add Certification" menu item
- [ ] CANNOT see "Delete Batch" menu item
- [ ] CANNOT see "Update Batch Status" component
- [ ] Can view batches they created

### Manufacturer Role Permissions
Login as manufacturer@test.com:
- [ ] CANNOT see "New Batch" button
- [ ] CAN see "Add Quality Metric" button (opens form)
- [ ] Quality Metrics form allows submission
- [ ] CAN see "Add Certification" option
- [ ] Certification form allows submission
- [ ] CANNOT see "Update Batch Status" component
- [ ] Can view all batches

### Distributor Role Permissions
Login as distributor@test.com:
- [ ] CANNOT see "New Batch" button
- [ ] CANNOT see "Add Quality Metric" button
- [ ] CANNOT see "Add Certification" option
- [ ] CAN see "Update Batch Status" component
- [ ] Status dropdown shows ONLY: In Transit, In Distribution, Delivered
- [ ] Can successfully update batch status
- [ ] Can view all batches

### Retailer Role Permissions
Login as retailer@test.com:
- [ ] CANNOT see "New Batch" button
- [ ] CANNOT see "Add Quality Metric" button
- [ ] CANNOT see "Add Certification" option
- [ ] CAN see "Update Batch Status" component
- [ ] Status dropdown shows ONLY: Delivered, Completed
- [ ] Can successfully update batch status
- [ ] Can view all batches

### Access Denial Messages
Test unauthorized actions:
- [ ] Supplier clicking quality metric shows "Access Denied" with role name
- [ ] Manufacturer trying to update status shows red card with permissions message
- [ ] Non-admin trying to edit batch shows "Access Denied"

---

## ✅ PART 4: BATCH MANAGEMENT (CREATE)

### Create Batch Dialog (Admin/Supplier)
Login as admin or supplier:
- [ ] Click "New Batch" button on /batches page
- [ ] Dialog opens with title "Create New Batch"
- [ ] Form shows all required fields:
  - [ ] Product Name (required)
  - [ ] Variety (optional)
  - [ ] Quantity (required, number)
  - [ ] Unit (required, default "kg")
  - [ ] Origin Location (required)
  - [ ] Harvest Date (optional, date picker)
  - [ ] NFC Tag ID (optional)

### Create Batch Validation
- [ ] Submit without Product Name → shows error
- [ ] Submit without Quantity → shows error
- [ ] Submit without Origin → shows error
- [ ] Submit with negative quantity → shows error
- [ ] Submit with all required fields → succeeds

### Create Batch Success
Create a test batch with:
- Product Name: "Organic Turmeric"
- Variety: "Lakadong"
- Quantity: 500
- Unit: kg
- Origin: "Meghalaya, India"
- Harvest Date: 2026-01-15

Then verify:
- [ ] Success message shown
- [ ] Dialog closes
- [ ] Batch appears in list on /batches page
- [ ] Batch has unique batchNumber (e.g., BTH-...)
- [ ] Batch has unique batchId
- [ ] Batch status is "Created"
- [ ] Can click batch to open detail page

### MongoDB Verification
Check MongoDB:
```bash
# In a mongo shell or MongoDB Compass
db.batches.find().pretty()
```
- [ ] Batch saved in MongoDB with all fields
- [ ] createdBy field matches logged-in user ID
- [ ] createdAt timestamp present
- [ ] status = "Created"

---

## ✅ PART 5: BATCH DETAIL PAGE

### Navigate to Batch Detail
Click on a batch from list:
- [ ] URL is /batches/[id]
- [ ] Page loads without errors
- [ ] Batch number shown in header
- [ ] Status badge visible
- [ ] Created date shown

### Overview Tab
- [ ] Tab is selected by default
- [ ] Product Details card shows:
  - [ ] Product Name
  - [ ] Variety
  - [ ] Quantity + Unit
- [ ] Logistics card shows:
  - [ ] Origin
  - [ ] Current Location (or N/A)
  - [ ] Harvest Date (or N/A)
- [ ] Identifiers card shows:
  - [ ] Internal ID (first 8 chars)
  - [ ] Public ID (batchId)
  - [ ] NFC Tag (or "Not Assigned")

### Timeline Tab
- [ ] Click "Timeline" tab
- [ ] Timeline renders
- [ ] Shows batch creation event with:
  - [ ] Event: "Batch Created"
  - [ ] Timestamp formatted correctly
  - [ ] Location = batch origin
  - [ ] Description includes product name and quantity

### Quality Tab
- [ ] Click "Quality" tab
- [ ] If no metrics: Shows "No quality reports available"
- [ ] Shows "Add Report" button (if user has permission)

### Documents Tab
- [ ] Click "Documents" tab
- [ ] Shows "No documents available" (initially)

### Action Buttons
- [ ] "Add Quality Metric" button visible (if manufacturer/admin)
- [ ] "More Actions" dropdown works
- [ ] Dropdown shows:
  - [ ] Edit Batch
  - [ ] Add Certification (if admin/manufacturer)
  - [ ] Add Quality Report
  - [ ] Generate QR Code
  - [ ] Delete Batch (if admin only)

---

## ✅ PART 6: QUALITY METRICS MANAGEMENT

### Add Quality Metric (Manufacturer/Admin)
Login as manufacturer or admin, go to batch detail:
- [ ] Click "Add Quality Metric" button
- [ ] Dialog opens with title "Add Quality Metric"
- [ ] Form shows all fields:
  - [ ] Metric Type (dropdown with 6 options)
  - [ ] Score (0-100, number input)
  - [ ] Unit (text input, e.g., %, mg/kg)
  - [ ] Status (dropdown: Pending/Passed/Failed)
  - [ ] Lab Name (optional)
  - [ ] Test Method (optional)
  - [ ] Report Number (optional)
  - [ ] Notes (optional)

### Quality Metric Validation
- [ ] Submit without Metric Type → error
- [ ] Submit with score > 100 → error
- [ ] Submit with score < 0 → error
- [ ] Score of 0 is accepted (bug fix verification)

### Quality Metric Submission
Add a test metric:
- Metric Type: "Curcumin Content"
- Score: 85
- Unit: "%"
- Status: "Passed"
- Lab Name: "Bureau Veritas"
- Test Method: "HPLC"
- Report Number: "BV-2026-0157"

Then verify:
- [ ] Dialog closes on success
- [ ] Batch detail page refreshes
- [ ] Quality tab now shows the metric
- [ ] Metric card displays:
  - [ ] Metric Type
  - [ ] Score/100
  - [ ] Lab Name
  - [ ] Status badge (green for Passed)

### MongoDB Verification
```bash
db.qualitymetrics.find().pretty()
```
- [ ] Quality metric saved with all fields
- [ ] batchId matches batch _id
- [ ] metricType saved correctly
- [ ] score saved (not value)
- [ ] unit field present
- [ ] inspectorId matches logged-in user

### Timeline Update
Go to Timeline tab:
- [ ] New "Quality Check" event appears
- [ ] Description shows: "Curcumin Content: Score 85/100 - Passed"
- [ ] Timestamp correct
- [ ] Events sorted chronologically (oldest first)

### Blockchain Verification
Check Ganache:
- [ ] TRANSACTIONS tab shows new transaction
- [ ] Transaction FROM address is blockchain service account
- [ ] Transaction TO address is BatchTracking contract
- [ ] Gas used shown

---

## ✅ PART 7: BATCH STATUS UPDATES

### Status Update Component (Distributor/Retailer/Admin)
Login as distributor, go to batch detail:
- [ ] "Update Batch Status" card visible on Overview tab
- [ ] Current Status shown (e.g., "Created")
- [ ] New Status dropdown shows allowed statuses only:
  - Distributor: In Transit, In Distribution, Delivered
  - Retailer: Delivered, Completed
  - Admin: All 10 statuses
- [ ] Location field (optional text input)
- [ ] Notes field (optional text input)
- [ ] "Update Status" button

### Update Status Flow
Update batch status:
- New Status: "In Transit"
- Location: "Distribution Center Mumbai"
- Notes: "Shipped via FedEx"

Then verify:
- [ ] Success message shows (green)
- [ ] Status updates in header badge
- [ ] Component refreshes with new current status
- [ ] Can update again to next status

### MongoDB Verification
```bash
db.batches.find().pretty()
db.statushistories.find().pretty()
```
- [ ] Batch status updated to "In Transit"
- [ ] StatusHistory document created with:
  - [ ] batchId
  - [ ] status = "In Transit"
  - [ ] location = "Distribution Center Mumbai"
  - [ ] notes = "Shipped via FedEx"
  - [ ] updatedBy = user ID
  - [ ] createdAt timestamp

### Timeline Update
Go to Timeline tab:
- [ ] New status change event appears
- [ ] Event: "In Transit"
- [ ] Location shown
- [ ] Description includes notes
- [ ] Timeline sorted chronologically

### Role Restriction Test
- [ ] Supplier cannot see status update component
- [ ] Manufacturer cannot see status update component
- [ ] Distributor can only select their allowed statuses
- [ ] Retailer can only select their allowed statuses

---

## ✅ PART 8: CERTIFICATION MANAGEMENT

### Add Certification (Admin/Manufacturer)
Login as admin or manufacturer, go to batch detail:
- [ ] Click "More Actions" → "Add Certification"
- [ ] Dialog opens
- [ ] Form shows all fields:
  - [ ] Certificate Name (required)
  - [ ] Certification Type (dropdown: organic, quality, safety, environmental, social, other)
  - [ ] Issuing Body (required, e.g., USDA, Bureau Veritas)
  - [ ] Issued Date (date picker)
  - [ ] Expiry Date (optional date picker)
  - [ ] Certificate Number (optional)
  - [ ] Document URL (optional)

### Certification Validation
- [ ] Submit without Name → error
- [ ] Submit without Issuing Body → error
- [ ] Submit without Type → error (defaults to "other")

### Certification Submission
Add a test certification:
- Name: "USDA Organic"
- Type: "organic"
- Issuing Body: "USDA"
- Issued Date: 2026-01-01
- Expiry Date: 2027-01-01
- Certificate Number: "CERT-2026-1234"

Then verify:
- [ ] Success message shown (green)
- [ ] Dialog closes after 1.5 seconds
- [ ] Form resets

### MongoDB Verification
```bash
db.certifications.find().pretty()
```
- [ ] Certification saved with all fields
- [ ] name = "USDA Organic"
- [ ] type = "organic"
- [ ] issuingBody = "USDA"
- [ ] issuedDate and expiryDate saved
- [ ] certificateNumber saved
- [ ] active = true (default)

### Role Restriction
- [ ] Supplier cannot access certification form (menu item hidden)
- [ ] Distributor cannot access certification form
- [ ] Retailer cannot access certification form
- [ ] Non-authorized users see "Access Denied" if they somehow open it

---

## ✅ PART 9: BATCH EDIT FUNCTIONALITY

### Edit Batch Access (Admin Only)
Login as admin, go to batch detail:
- [ ] Click "More Actions" → "Edit Batch"
- [ ] Redirects to /batches/[id]/edit
- [ ] Edit form loads with current batch data pre-filled

### Edit Form Pre-population
- [ ] Product Name pre-filled
- [ ] Variety pre-filled
- [ ] Quantity pre-filled
- [ ] Unit pre-filled
- [ ] Origin pre-filled
- [ ] Harvest Date pre-filled (if exists)
- [ ] Expiry Date pre-filled (if exists)

### Edit Validation
- [ ] Cannot clear Product Name → error
- [ ] Cannot clear Quantity → error
- [ ] Cannot clear Origin → error
- [ ] Cannot set negative quantity → error

### Edit Submission
Change values:
- Quantity: 550 (was 500)
- Expiry Date: 2026-12-31 (new)

Then verify:
- [ ] "Saving..." shown on button
- [ ] Redirects to batch detail page after save
- [ ] Updated values shown in Overview tab
- [ ] Quantity now shows 550 kg
- [ ] Expiry date shown in cards

### MongoDB Verification
```bash
db.batches.findOne({_id: ObjectId("...")})
```
- [ ] quantity = 550
- [ ] expiryDate updated
- [ ] updatedAt timestamp changed

### Role Restriction
Login as non-admin (supplier/manufacturer/distributor):
- [ ] Navigate to /batches/[id]/edit
- [ ] Shows red "Access Denied" card
- [ ] Card shows user role
- [ ] Card says "Only Admin role can edit batches"
- [ ] Form not rendered

---

## ✅ PART 10: BATCH LIST & FILTERING

### Batch List Page
Navigate to /batches:
- [ ] Page title: "Batches"
- [ ] Subtitle: "Manage supply chain batches"
- [ ] BatchTable component renders
- [ ] Shows list of all batches
- [ ] Each row shows:
  - [ ] Batch Number
  - [ ] Product Name
  - [ ] Origin
  - [ ] Status badge
  - [ ] Created Date
  - [ ] Action buttons/links

### Filters
- [ ] Status filter dropdown visible
- [ ] Options: All Statuses, Created, Processing, Quality Check, In Transit, Delivered, Completed
- [ ] Selecting filter updates the list
- [ ] URL params update (optional optimization)

### Export Button
- [ ] "Export" button visible
- [ ] Button shows Download icon
- [ ] Click shows placeholder (TODO: Export CSV)

### Create Button Visibility
- [ ] Admin sees "New Batch" button
- [ ] Supplier sees "New Batch" button
- [ ] Manufacturer does NOT see button
- [ ] Distributor does NOT see button
- [ ] Retailer does NOT see button

### Batch Row Click
- [ ] Clicking batch row navigates to detail page
- [ ] Clicking action buttons works (if present)

### Loading State
Refresh page:
- [ ] Shows loading spinner while fetching
- [ ] Spinner is green (matches theme)
- [ ] Data loads after fetch completes

---

## ✅ PART 11: UI/UX ELEMENTS

### Dropdown Transparency Fix
- [ ] Open any Select dropdown (metric type, status, etc.)
- [ ] Dropdown background is white (not transparent)
- [ ] Options are clickable
- [ ] Clicking option does NOT trigger elements behind it
- [ ] Selected value shows in trigger

### Dialog/Modal Backgrounds
- [ ] Quality Metrics dialog has white background
- [ ] Certification dialog has white background
- [ ] Create Batch dialog has white background
- [ ] No transparency issues in any dialog

### Form Field Visibility
All forms have proper styling:
- [ ] Input fields have white/light background
- [ ] Labels clearly visible
- [ ] Placeholder text readable
- [ ] Error messages red and visible
- [ ] Success messages green and visible

### Sidebar Navigation
- [ ] Sidebar fixed on left
- [ ] Links: Dashboard, Batches, Users, Quality, Certifications, Analytics
- [ ] Active link highlighted
- [ ] Icons visible
- [ ] Hover effects work

### Header
- [ ] DashboardHeader shows at top
- [ ] Shows user name/role
- [ ] Profile dropdown works
- [ ] Logout option visible

### Responsive Layout
Test on different screen sizes:
- [ ] Sidebar collapses on mobile (if implemented)
- [ ] Tables scroll horizontally on mobile
- [ ] Forms adjust to screen width
- [ ] Dialogs centered and responsive

---

## ✅ PART 12: ERROR HANDLING

### Network Errors
Simulate by stopping a service:
- [ ] Stop trace-service
- [ ] Try creating batch → shows error message
- [ ] Error message is user-friendly
- [ ] Form doesn't crash
- [ ] Can retry after restarting service

### Validation Errors
- [ ] 400 errors show specific field errors
- [ ] Error messages displayed near relevant fields
- [ ] Form stays populated after error
- [ ] Can correct and resubmit

### Authentication Errors
- [ ] Expired token redirects to login
- [ ] Invalid token redirects to login
- [ ] Unauthorized actions show 403 message

### 404 Errors
- [ ] Navigate to non-existent batch ID
- [ ] Shows "Batch not found" or similar message
- [ ] Option to go back

---

## ✅ PART 13: BLOCKCHAIN INTEGRATION

### Contract Deployment Verification
In Ganache UI:
- [ ] CONTRACTS tab shows 2 contracts
- [ ] BatchTracking contract address matches deployment output
- [ ] SupplyChainStatus contract address matches deployment output

### Transaction Creation
After creating batch, adding quality metric, updating status:
- [ ] TRANSACTIONS tab shows new entries
- [ ] Transaction hash visible
- [ ] FROM address is blockchain service account (first Ganache account)
- [ ] TO address is contract address
- [ ] Block number increments
- [ ] Gas used shown

### Block Mining
- [ ] BLOCKS tab shows increasing block numbers
- [ ] Each transaction creates a new block
- [ ] Block timestamp updates
- [ ] Block contains transaction hash

### Account Balance Changes
- [ ] ACCOUNTS tab shows first account (deployer)
- [ ] Balance decreased from 1000 ETH
- [ ] Gas fees deducted for each transaction

### Blockchain Service Logs
Check terminal running blockchain service:
- [ ] No errors when processing transactions
- [ ] Successfully connected to Ganache
- [ ] Contract interactions logged

### MongoDB vs Blockchain
Verify dual storage:
- [ ] Batch data in MongoDB (full details)
- [ ] Batch transaction hash in MongoDB (blockchainTxHash field, if implemented)
- [ ] Transaction recorded in Ganache (immutable proof)
- [ ] Both systems in sync

---

## ✅ PART 14: USERS MANAGEMENT (Admin Only)

### Users Page Access
Login as admin:
- [ ] Navigate to /users
- [ ] Page loads
- [ ] Shows list of users
- [ ] Each user shows: Name, Email, Role, Status, Actions

Login as non-admin:
- [ ] /users page redirected or shows access denied
- [ ] Sidebar link hidden or disabled

### User List Display
- [ ] Shows all registered users
- [ ] Admin user visible
- [ ] Test users visible (supplier, manufacturer, etc.)
- [ ] Active status shown (green badge)
- [ ] Inactive status shown (gray badge)

### Change User Role
- [ ] Each user has role dropdown or "Change Role" button
- [ ] Can select new role from dropdown
- [ ] Submit/Save button
- [ ] Success message after role change
- [ ] User role updated in list

### Create New User (if implemented)
- [ ] "Add User" button visible
- [ ] Form opens with fields: Name, Email, Password, Role
- [ ] Can create user successfully
- [ ] New user appears in list

---

## ✅ PART 15: PERFORMANCE & OPTIMIZATION

### Page Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Batch list loads < 2 seconds
- [ ] Batch detail loads < 2 seconds
- [ ] No unnecessary re-renders (check React DevTools)

### API Response Times
- [ ] GET /api/batches responds < 500ms
- [ ] GET /api/batches/:id responds < 300ms
- [ ] POST requests respond < 1 second
- [ ] No hanging requests

### Data Refresh
- [ ] After creating batch, list auto-updates
- [ ] After adding quality metric, detail page refreshes
- [ ] After status update, page shows new status immediately

### Loading States
- [ ] Spinners shown during data fetch
- [ ] Buttons disabled during submission
- [ ] "Loading..." or "Saving..." text shown
- [ ] No blank screens during loads

---

## ✅ PART 16: DATA INTEGRITY

### Batch Data Consistency
Check MongoDB:
```javascript
db.batches.aggregate([
  {
    $lookup: {
      from: "qualitymetrics",
      localField: "_id",
      foreignField: "batchId",
      as: "metrics"
    }
  },
  {
    $lookup: {
      from: "statushistories",
      localField: "_id",
      foreignField: "batchId",
      as: "history"
    }
  }
])
```
- [ ] Batch has related quality metrics
- [ ] Batch has related status history
- [ ] All references valid (no orphaned data)

### User References
- [ ] Batches have valid createdBy user IDs
- [ ] Quality metrics have valid inspectorId
- [ ] Status history has valid updatedBy

### Timestamps
- [ ] All documents have createdAt
- [ ] Updated documents have updatedAt
- [ ] Timestamps logical (not future dates)

---

## ✅ PART 17: SECURITY CHECKS

### Token Security
- [ ] Tokens stored securely (httpOnly cookies if implemented)
- [ ] Tokens expire after set time
- [ ] Refresh token mechanism works (if implemented)
- [ ] Invalid tokens rejected by server

### Role Enforcement
- [ ] Server validates roles on protected endpoints
- [ ] Client-side role checks match server-side
- [ ] Cannot bypass role checks via API calls directly

### Input Sanitization
- [ ] XSS attempts blocked (<script> tags, etc.)
- [ ] SQL injection not applicable (NoSQL)
- [ ] NoSQL injection prevented (query sanitization)

### Password Security
- [ ] Passwords hashed in database (not plaintext)
- [ ] Password not returned in API responses
- [ ] Password requirements enforced (if implemented)

---

## ✅ PART 18: FINAL INTEGRATION TEST

### Complete User Journey - Admin
1. [ ] Login as admin
2. [ ] Create new batch
3. [ ] View batch detail
4. [ ] Add quality metric
5. [ ] Update batch status
6. [ ] Add certification
7. [ ] Edit batch details
8. [ ] View timeline (shows all events in order)
9. [ ] Check Ganache transactions (4+ new transactions)
10. [ ] Logout

### Complete User Journey - Manufacturer
1. [ ] Login as manufacturer
2. [ ] View batch list
3. [ ] Open batch detail
4. [ ] Add quality metric successfully
5. [ ] Add certification successfully
6. [ ] Cannot update status (component hidden)
7. [ ] Cannot edit batch (access denied)
8. [ ] View timeline
9. [ ] Logout

### Complete User Journey - Distributor
1. [ ] Login as distributor
2. [ ] View batch list
3. [ ] Open batch detail
4. [ ] Cannot add quality metric (button hidden)
5. [ ] Update status to "In Transit"
6. [ ] Update status to "In Distribution"
7. [ ] Update status to "Delivered"
8. [ ] View timeline (shows status updates)
9. [ ] Check Ganache (3 new transactions)
10. [ ] Logout

### Data Verification After All Tests
MongoDB Collections:
```bash
db.batches.countDocuments()
db.qualitymetrics.countDocuments()
db.statushistories.countDocuments()
db.certifications.countDocuments()
db.users.countDocuments()
```
- [ ] Counts match expected (1+ batches, 2+ metrics, 3+ status records, 1+ certs, 5+ users)
- [ ] No duplicate entries
- [ ] All data valid

Ganache:
- [ ] 15+ total transactions
- [ ] 15+ total blocks
- [ ] First account balance significantly decreased
- [ ] All transactions successful (no reverts)

---

## 🐛 KNOWN ISSUES TO FIX (From Audit)

### Critical
1. [ ] Timeline metric description uses wrong fields (metric.value → metric.score)
2. [ ] CertificationForm JSX fields don't match schema (issueDate → issuedDate)

### High Priority
3. [ ] EditBatchForm missing role-based access control
4. [ ] Certification form JSX missing type dropdown field
5. [ ] Certification form JSX missing documentUrl field

### Medium Priority
6. [ ] Export CSV functionality placeholder
7. [ ] QR Code generation placeholder
8. [ ] Batch deletion functionality not implemented

---

## 📊 VERIFICATION SUMMARY

Total Checkpoints: **320+**

### Progress Tracking
- **Part 1-5**: System Setup & Basic CRUD → [ ] Complete
- **Part 6-9**: Advanced Features & RBAC → [ ] Complete
- **Part 10-14**: UI/UX & Management → [ ] Complete
- **Part 15-18**: Performance & Integration → [ ] Complete

### Sign-Off
- [ ] All critical issues fixed
- [ ] All high priority issues addressed
- [ ] System ready for demo/presentation
- [ ] Documentation updated

---

**Date Started**: ___________  
**Date Completed**: ___________  
**Tested By**: ___________  
**Final Status**: ___________
