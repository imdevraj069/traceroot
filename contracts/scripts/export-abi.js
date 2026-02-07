/**
 * Export ABI Script
 * Copies compiled contract ABIs to the blockchain-service for use
 */
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build', 'contracts');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'server', 'blockchain-service', 'src', 'contracts');

const CONTRACTS = ['BatchTracking', 'SupplyChainStatus'];

function exportABI() {
    console.log('📦 Exporting Contract ABIs...\n');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`✅ Created directory: ${OUTPUT_DIR}`);
    }

    CONTRACTS.forEach(contractName => {
        const sourcePath = path.join(BUILD_DIR, `${contractName}.json`);
        const destPath = path.join(OUTPUT_DIR, `${contractName}.json`);

        if (!fs.existsSync(sourcePath)) {
            console.log(`⚠️  ${contractName}.json not found. Run 'truffle compile' first.`);
            return;
        }

        // Read and extract ABI
        const contractJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        const abiOnly = {
            contractName: contractJson.contractName,
            abi: contractJson.abi,
            networks: contractJson.networks || {}
        };

        // Write to destination
        fs.writeFileSync(destPath, JSON.stringify(abiOnly, null, 2));
        console.log(`✅ Exported ${contractName}.json (${contractJson.abi.length} functions)`);
    });

    console.log('\n🎉 ABI export complete!');
    console.log(`📁 Output: ${OUTPUT_DIR}`);
}

exportABI();
