const BatchTracking = artifacts.require("BatchTracking");
const { expect } = require("chai");

contract("BatchTracking", (accounts) => {
    const [owner, farmer, inspector, distributor] = accounts;
    let batchTracking;

    beforeEach(async () => {
        batchTracking = await BatchTracking.new();
    });

    describe("Batch Creation", () => {
        it("should create a new batch", async () => {
            const batchId = "BATCH-001";
            const productName = "Organic Turmeric";
            const variety = "Erode";
            const quantity = 1000;
            const unit = "kg";
            const location = "Tamil Nadu, India";
            const harvestDate = Math.floor(Date.now() / 1000);
            const expiryDate = harvestDate + 365 * 24 * 60 * 60; // 1 year
            const nfcTagId = "NFC-001";

            const tx = await batchTracking.createBatch(
                batchId,
                productName,
                variety,
                quantity,
                unit,
                location,
                harvestDate,
                expiryDate,
                nfcTagId,
                { from: farmer }
            );

            // Verify batch was created
            const totalBatches = await batchTracking.getTotalBatches();
            expect(totalBatches.toNumber()).to.equal(1);

            // Verify batch details
            const batch = await batchTracking.getBatch(batchId);
            expect(batch.productName).to.equal(productName);
            expect(batch.variety).to.equal(variety);
            expect(batch.quantity.toNumber()).to.equal(quantity);
        });

        it("should not allow duplicate batch IDs", async () => {
            const batchId = "BATCH-001";
            await batchTracking.createBatch(
                batchId, "Product", "Variety", 100, "kg", "Location",
                Date.now(), Date.now() + 86400, "NFC-001", { from: farmer }
            );

            try {
                await batchTracking.createBatch(
                    batchId, "Product 2", "Variety 2", 200, "kg", "Location 2",
                    Date.now(), Date.now() + 86400, "NFC-002", { from: farmer }
                );
                expect.fail("Should have thrown");
            } catch (error) {
                expect(error.message).to.include("Batch already exists");
            }
        });
    });

    describe("Quality Metrics", () => {
        const batchId = "BATCH-001";

        beforeEach(async () => {
            await batchTracking.createBatch(
                batchId, "Turmeric", "Erode", 1000, "kg", "India",
                Date.now(), Date.now() + 86400, "NFC-001", { from: farmer }
            );
        });

        it("should add quality metric to batch", async () => {
            const metricId = "QM-001";
            await batchTracking.addQualityMetric(
                metricId, batchId, "curcumin_content", "5.2", "%",
                { from: inspector }
            );

            const metrics = await batchTracking.getBatchQualityMetrics(batchId);
            expect(metrics.length).to.equal(1);
            expect(metrics[0]).to.equal(metricId);
        });
    });

    describe("NFC Authentication", () => {
        const batchId = "BATCH-001";
        const nfcTagId = "NFC-001";

        beforeEach(async () => {
            await batchTracking.createBatch(
                batchId, "Turmeric", "Erode", 1000, "kg", "India",
                Date.now(), Date.now() + 86400, nfcTagId, { from: farmer }
            );
        });

        it("should authenticate valid NFC tag", async () => {
            const authId = "AUTH-001";
            const result = await batchTracking.authenticateNFC(
                authId, batchId, nfcTagId, "Retail Store",
                { from: distributor }
            );

            // Check authentication result
            const authDetails = await batchTracking.getAuthenticationDetails(authId);
            expect(authDetails.isValid).to.be.true;
        });

        it("should detect invalid NFC tag", async () => {
            const authId = "AUTH-002";
            await batchTracking.authenticateNFC(
                authId, batchId, "FAKE-NFC", "Unknown Location",
                { from: distributor }
            );

            const authDetails = await batchTracking.getAuthenticationDetails(authId);
            expect(authDetails.isValid).to.be.false;
        });

        it("should track authentication count", async () => {
            await batchTracking.authenticateNFC(
                "AUTH-001", batchId, nfcTagId, "Location 1", { from: distributor }
            );
            await batchTracking.authenticateNFC(
                "AUTH-002", batchId, nfcTagId, "Location 2", { from: distributor }
            );

            const count = await batchTracking.getNFCAuthCount(nfcTagId);
            expect(count.toNumber()).to.equal(2);
        });
    });
});
