# ✅ Complete Integration Test Guide

## 🎯 System Status

✅ **Ganache Desktop**: Running on port 8545  
✅ **Blockchain Service**: Running on port 8003 with correct contract addresses  
✅ **Auth Service**: Running on port 8001  
✅ **Trace Service**: Running on port 8002  
✅ **MongoDB**: Connected   

**Contract Addresses Configured:**
- BatchTracking: `0x0AfE227759f9612232bbcC933D19b5435A219c58`
- SupplyChainStatus: `0x7A6b07E224cE6101e558B18aF2FFc564292752B0`
- Network ID: `1770488925376`

---

## 🚀 TEST FLOW: Create Batch → See Blockchain Transaction

### Step 1: Start Admin Frontend
```bash
cd client/admin
npm run dev
```
Frontend will open at: **http://localhost:3000**

### Step 2: Login to Admin Panel
- Email: `admin@test.com` (or any admin account)
- Password: Your password
- Click "Login"

### Step 3: Create a Test Batch
1. Click **"Batches"** in sidebar
2. Click **"New Batch"** button (top right)
3. Fill in the form:
   - **Product Name**: "Test Turmeric"
   - **Variety**: "Lakadong"
   - **Quantity**: 500
   - **Unit**: kg
   - **Origin**: "Meghalaya, India"
   - **Harvest Date**: 2026-01-15 (any date)
4. Click **"Create Batch"**

### Step 4: Watch Ganache for Transaction ⭐
1. **Open Ganache Desktop UI** (the .exe app)
2. Make sure in the workspace see the **TRANSACTIONS** tab at top
3. **Immediately after clicking "Create Batch"**, a **NEW TRANSACTION** should appear in Ganache showing:
   - From: 0x4Df5... (first account)
   - To: BatchTracking contract address
   - Gas Used: ~XXX XXX
   - Status: Success ✓

### Step 5: Verify in MongoDB
Open MongoDB Compass or mongo shell:
```bash
# See the new batch
db.batches.find({productName: "Test Turmeric"}).pretty()

# See blockchain transaction record
db.batches.findOne({productName: "Test Turmeric"}).then(doc => {
  console.log("Blockchain TX Hash:", doc.blockchainTxHash)
})
```

---

## 🔍 ADVANCED TESTS

### Test Quality Metrics → Blockchain
1. Go to Batch Detail page (click the batch you just created)
2. Click **"Add Quality Metric"** button
3. Fill form:
   - Metric Type: "Curcumin Content"
   - Score: 85
   - Unit: %
   - Status: Passed
4. Click **"Submit"**
5. **Check Ganache TRANSACTIONS tab** → New transaction should appear

### Test Status Update → Blockchain
1. On Batch Detail page, find **"Update Batch Status"** card
2. New Status: "In Transit"
3. Location: "Distribution Hub"
4. Click **"Update Status"**
5. **Check Ganache TRANSACTIONS tab** → New transaction should appear

### Test Role-Based Access
Login as different roles and verify:
- **Admin**: Can create batches, add metrics, add certifications, update status, edit batch
- **Supplier**: Can create batches (✓), cannot add metrics, cannot certify
- **Manufacturer**: Cannot create batches, can add metrics, can add certifications
- **Distributor**: Cannot create batches, can ONLY update status to: In Transit, In Distribution, Delivered
- **Retailer**: Cannot create batches, can ONLY update status to: Delivered, Completed

---

## 📊 DEBUGGING CHECKLIST

### If no transaction appears in Ganache:

**Check 1: Blockchain Service Logs**
```bash
# Terminal running blockchain-service should show:
# "MongoDB Connected: localhost"
# "Blockchain Service is running on port 8003"
# When you create batch: "Batch transaction recorded: 0x..."
```

**Check 2: Verify Contract Connection**
```bash
curl http://localhost:8003 -UseBasicParsing
# Should return: {"service":"blockchain-service","status":"running","port":"8003"}
```

**Check 3: Verify .env.local Configuration**
```bash
cat server/blockchain-service/.env.local
# Must show:
# BATCH_TRACKING_ADDRESS=0x0AfE227759f9612232bbcC933D19b5435A219c58
# SUPPLY_CHAIN_ADDRESS=0x7A6b07E224cE6101e558B18aF2FFc564292752B0
# BLOCKCHAIN_CHAIN_ID=1770488925376
```

**Check 4: Restart Blockchain Service**
If you see old transaction hashes in logs, restart:
```bash
# Kill old process
taskkill /F /IM node.exe  # Or stop via task manager

# Restart
cd server/blockchain-service
npm start
```

**Check 5: Verify Admin Panel is Creating Batches**
Go to http://localhost:3000/batches
- Should see new batch in the list
- If batch appears but no Ganache transaction:
  1. Check trace-service logs (port 8002)
  2. Check auth-service logs (port 8001)
  3. Verify MongoDB has the batch document

---

## 📝 EXPECTED OUTCOMES

### Upon Successful Setup:
1. ✅ Batches appear in admin panel AND MongoDB
2. ✅ Creating batch triggers transaction visible in Ganache
3. ✅ Transaction count increases in Ganache BLOCKS tab
4. ✅ Batch detail shows blockchain transaction hash
5. ✅ Quality metrics create transactions
6. ✅ Status updates create transactions
7. ✅ Role-based buttons show/hide correctly

### Ganache Indicators:
- **ACCOUNTS**: First account balance decreases (gas used)
- **BLOCKS**: Block number increases with each transaction (0 → 1 → 2 → etc)
- **TRANSACTIONS**: New entries appear real-time
- **CONTRACTS**: BatchTracking and SupplyChainStatus visible with addresses

---

## 🎓 DATA FLOW SUMMARY

```
Admin Panel (http://localhost:3000)
     ↓
Create Batch
     ↓
Trace Service (8002) - Saves to MongoDB
     ↓
Blockchain Service (8003) - Calls Smart Contract
     ↓
Ganache (8545) - Executes Transaction
     ↓
New Block + Transaction Hash → MongoDB record
     ↓
Admin Panel displays blockchain hash on batch detail
```

---

## ✨ NEXT VERIFICATION TASKS

After confirming transactions appear in Ganache:
- [ ] Complete Part 3: RBAC Testing (all 5 roles)
- [ ] Complete Part 4-5: Batch CRUD operations
- [ ] Complete Part 6-7: Quality metrics full workflow
- [ ] Complete Part 8-9: Certifications full workflow
- [ ] Complete Part 10-12: UI/UX polish verification
- [ ] Complete Part 18: Full integration user journeys

---

**Last Updated**: 2026-02-08  
**System Ready**: ✅ Yes - Ready for testing batch creation
