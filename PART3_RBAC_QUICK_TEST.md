# 🚀 START TESTING NOW - PART 3: RBAC

## 🎯 Admin Frontend Ready
**goto**: http://localhost:3001

---

## Phase 1: Create Test Accounts (First Time Only)

### Step 1: Login or Create Admin Account
```
Email: admin@test.com
Password: admin123
Role: Admin
```

### Step 2: Create Additional Test Accounts
Once logged in as Admin, create these accounts:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| supplier@test.com | supplier123 | Supplier | Can create batches |
| manufacturer@test.com | manufacturer123 | Manufacturer | Can add metrics/certifications |
| distributor@test.com | distributor123 | Distributor | Can update status |
| retailer@test.com | retailer123 | Retailer | Can mark delivered |

---

## Phase 2: RBAC Verification Tests

### Test 1: Login as ADMIN
**Actions to verify**:
- [ ] Click "Batches" → "New Batch" button visible ✅
- [ ] Can see batch detail page
- [ ] "Add Quality Metric" button visible ✅
- [ ] "Add Certification" in More Actions ✅
- [ ] "Update Batch Status" component visible ✅
- [ ] Status dropdown shows ALL options ✅
- [ ] Can access "/users" page ✅

### Test 2: Login as SUPPLIER
**Logout** (click profile → Logout)  
**Login**: supplier@test.com / supplier123

**Actions to verify**:
- [ ] "New Batch" button IS visible ✅
- [ ] Can create batch successfully
- [ ] "Add Quality Metric" button is HIDDEN ❌
- [ ] "Add Certification" is HIDDEN ❌
- [ ] "Update Status" component is HIDDEN ❌
- [ ] Cannot access "/users" page ❌

### Test 3: Login as MANUFACTURER
**Logout**  
**Login**: manufacturer@test.com / manufacturer123

**Actions to verify**:
- [ ] "New Batch" button is HIDDEN ❌
- [ ] "Add Quality Metric" button IS visible ✅
- [ ] "Add Certification" IS visible ✅
- [ ] "Update Status" button is HIDDEN ❌
- [ ] "Delete Batch" is HIDDEN ❌

### Test 4: Login as DISTRIBUTOR
**Logout**  
**Login**: distributor@test.com / distributor123

**Actions to verify**:
- [ ] "New Batch" button is HIDDEN ❌
- [ ] "Add Quality Metric" button is HIDDEN ❌
- [ ] "Update Status" button IS visible ✅
- [ ] Status dropdown shows: **In Transit, In Distribution, Delivered** only
- [ ] Other status options NOT visible ❌

### Test 5: Login as RETAILER
**Logout**  
**Login**: retailer@test.com / retailer123

**Actions to verify**:
- [ ] "New Batch" button is HIDDEN ❌
- [ ] "Add Quality Metric" button is HIDDEN ❌
- [ ] "Update Status" button IS visible ✅
- [ ] Status dropdown shows: **Delivered, Completed** only
- [ ] Other status options NOT visible ❌

---

## 🎯 Quick Test: Create Your First Batch

### As Admin:
1. Click "Batches" → "New Batch"
2. Fill in:
   - Product Name: **"Test Product"**
   - Quantity: **100**
   - Unit: **"kg"**
   - Origin: **"Test Location"**
3. Click "Create Batch"

### Watch Ganache:
1. Open **Ganache Desktop UI** (app on desktop/taskbar)
2. Go to **TRANSACTIONS** tab
3. **Within 2-5 seconds**, a NEW TRANSACTION should appear 🎉

**If you see the transaction → Blockchain integration is working!**

---

## ✅ Part 3 Complete When:
- ✅ All 5 roles can login
- ✅ Admin sees all buttons
- ✅ Supplier can create batches
- ✅ Manufacturer can add metrics
- ✅ Distributor has status button with limited options
- ✅ Retailer has status button with limited options
- ✅ First batch created with Ganache transaction visible

---

## 🚨 Troubleshooting

**Can't login?**
- Verify auth service running: `curl http://localhost:8001`
- Check browser console (F12) for errors

**"New Batch" button not showing?**
- Logout and login again
- Try different role
- Check browser console

**No Ganache transaction?**
- Check if trace-service is running: `curl http://localhost:8002`
- Verify blockchain-service: `curl http://localhost:8003`
- Check if Ganache app is open

**Status dropdown empty?**
- Refresh page (Ctrl+R)
- Check browser console for errors
- Logout and login again

---

## 📊 Progress Tracking

**Part 3 Checklist**:
- [ ] Admin account created
- [ ] Test accounts created
- [ ] Admin RBAC verified
- [ ] Supplier permissions correct
- [ ] Manufacturer permissions correct
- [ ] Distributor permissions correct
- [ ] Retailer permissions correct
- [ ] First batch created
- [ ] Transaction visible in Ganache

**When all checked → Move to Part 4-5**

---

**Ready? Go to http://localhost:3001 and start testing!** 🚀
