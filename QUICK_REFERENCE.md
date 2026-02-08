# 📋 TESTING QUICK REFERENCE

## 🎯 YOU ARE HERE: Part 3 - RBAC Testing

---

## 🌐 Access Points

| Component | URL/Port | Status |
|-----------|----------|--------|
| Admin Frontend | http://localhost:3001 | ✅ Running |
| Auth Service | http://localhost:8001 | ✅ Running |
| Trace Service | http://localhost:8002 | ✅ Running |
| Blockchain Service | http://localhost:8003 | ✅ Running |
| Ganache | http://localhost:8545 | ✅ Running |
| MongoDB | localhost:27017 | ✅ Connected |

---

## 📋 Testing Parts Breakdown

### ✅ COMPLETED
- Part 1: System Startup & Connectivity
- Part 2: Authentication & User Management

### 🔄 IN PROGRESS
- **Part 3: RBAC** ← You are here
  - Login as 5 different roles
  - Verify buttons show/hide correctly
  - Create test accounts
  - See [PART3_RBAC_QUICK_TEST.md](PART3_RBAC_QUICK_TEST.md)

### ⏭️ NEXT
- **Part 4-5: Batch CRUD**
  - Create batch → See Ganache transaction
  - Edit batch (admin only)
  - Delete batch (admin only)
  - View batch details and timeline

- **Part 6-7: Quality & Status**
  - Add quality metric → See Ganache transaction
  - Update status → See Ganache transaction
  - Verify role-limited status options

- **Part 8-9: Certifications**
  - Add certifications (admin/manufacturer)
  - Verify access denied for others

- **Part 10-12: UI/UX**
  - Form validation
  - Error/success messages
  - Loading states
  - Dropdown behavior

---

## 🎯 Part 3: RBAC Testing

### Test Accounts
```
Admin:           admin@test.com / admin123
Supplier:        supplier@test.com / supplier123
Manufacturer:    manufacturer@test.com / manufacturer123
Distributor:     distributor@test.com / distributor123
Retailer:        retailer@test.com / retailer123
```

### What to Check (✅ = should see, ❌ = should NOT see)

**Admin Role:**
- ✅ New Batch button
- ✅ Add Quality Metric button
- ✅ Add Certification option
- ✅ Update Status button (all statuses)
- ✅ Delete Batch option
- ✅ Edit Batch option

**Supplier Role:**
- ✅ New Batch button
- ❌ Add Quality Metric
- ❌ Add Certification
- ❌ Update Status
- ❌ Edit Batch

**Manufacturer Role:**
- ❌ New Batch button
- ✅ Add Quality Metric button
- ✅ Add Certification option
- ❌ Update Status
- ❌ Edit Batch

**Distributor Role:**
- ❌ New Batch button
- ❌ Add Quality Metric
- ✅ Update Status button
- ⚠️ Status options: In Transit, In Distribution, Delivered ONLY
- ❌ Edit Batch

**Retailer Role:**
- ❌ New Batch button
- ❌ Add Quality Metric
- ✅ Update Status button
- ⚠️ Status options: Delivered, Completed ONLY
- ❌ Edit Batch

---

## 🔍 Blockchain Transaction Checklist

When you create a batch:
- [ ] Batch appears in admin panel
- [ ] Ganache TRANSACTIONS tab shows new transaction
- [ ] Transaction FROM address: 0x3080... (blockchain service)
- [ ] Transaction TO address: 0x0AfE... (BatchTracking contract)
- [ ] Status: Success ✓
- [ ] Gas used: ~XXX
- [ ] MongoDB record has blockchainTxHash field

---

## 📊 Progress Indicators

**Part 3 Complete When:**
```
✅ Can login as all 5 roles
✅ Admin sees all buttons
✅ Supplier sees only New Batch
✅ Manufacturer sees Quality & Certification
✅ Distributor sees Status (limited options)
✅ Retailer sees Status (Delivered/Completed only)
✅ Created first batch with Ganache transaction
```

---

## 🚨 Quick Fixes If Issues

### "Can't login"
```bash
curl http://localhost:8001
# Should return: {"service":"auth-service","status":"running"}
```

### "No transaction in Ganache"
```bash
curl http://localhost:8003
# Should return: {"service":"blockchain-service","status":"running"}
```

### "Button not appearing"
- Logout → Login again
- Refresh page (Ctrl+R)
- Check browser console (F12 → Console tab)

### "Form won't submit"
- Check browser console for errors
- Verify trace-service running: `curl http://localhost:8002`
- Try with different data

---

## 📚 Full Documentation

- [PART3_RBAC_QUICK_TEST.md](PART3_RBAC_QUICK_TEST.md) - Step-by-step Part 3
- [COMPLETE_TESTING_WORKFLOW.md](COMPLETE_TESTING_WORKFLOW.md) - All 5 parts detailed
- [READY_FOR_TESTING.md](READY_FOR_TESTING.md) - Overview & features
- [VERIFICATION_PLAN.md](VERIFICATION_PLAN.md) - Comprehensive checklist

---

## ⏱️ Estimated Time

| Part | Time | Status |
|------|------|--------|
| 1-2 | ~30 min | ✅ Done |
| 3 | 10-15 min | 🔄 Now |
| 4-5 | 15-20 min | ⏭️ Next |
| 6-7 | 20-25 min | ⏭️ Next |
| 8-9 | 15-20 min | ⏭️ Next |
| 10-12 | 10-15 min | ⏭️ Next |
| **Total** | **~90 min** | |

---

## 🎊 YOU'RE ALL SET!

1️⃣ Open **http://localhost:3001**  
2️⃣ Follow **[PART3_RBAC_QUICK_TEST.md](PART3_RBAC_QUICK_TEST.md)**  
3️⃣ Create accounts & test RBAC  
4️⃣ Open Ganache Desktop UI  
5️⃣ Create your first batch!

Go! 🚀
