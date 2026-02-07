const BatchTracking = artifacts.require("BatchTracking");
const SupplyChainStatus = artifacts.require("SupplyChainStatus");

module.exports = async function (deployer, network, accounts) {
    console.log(`🚀 Deploying to ${network}...`);
    console.log(`📍 Deployer address: ${accounts[0]}`);

    // Deploy BatchTracking
    await deployer.deploy(BatchTracking);
    const batchTracking = await BatchTracking.deployed();
    console.log(`✅ BatchTracking deployed at: ${batchTracking.address}`);

    // Deploy SupplyChainStatus
    await deployer.deploy(SupplyChainStatus);
    const supplyChainStatus = await SupplyChainStatus.deployed();
    console.log(`✅ SupplyChainStatus deployed at: ${supplyChainStatus.address}`);

    // Save deployment info
    console.log("\n📋 Deployment Summary:");
    console.log("========================");
    console.log(`Network: ${network}`);
    console.log(`BatchTracking: ${batchTracking.address}`);
    console.log(`SupplyChainStatus: ${supplyChainStatus.address}`);
    console.log("========================\n");
};
