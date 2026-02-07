#!/usr/bin/env node

/**
 * Extract contract addresses from Ganache and update blockchain-service .env
 * Run after: npx truffle migrate --network development --reset
 */

const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

const GANACHE_RPC = 'http://127.0.0.1:8545';
const ARTIFACTS_PATH = path.join(__dirname, '../contracts/build/contracts');
const ENV_FILE = path.join(__dirname, '../server/blockchain-service/.env.local');

async function extractAddresses() {
    console.log('🔍 Extracting contract addresses from Ganache...\n');

    try {
        // Connect to Ganache
        const web3 = new Web3(GANACHE_RPC);
        const isConnected = await web3.eth.net.isListening();
        
        if (!isConnected) {
            throw new Error('Cannot connect to Ganache on ' + GANACHE_RPC);
        }
        console.log('✅ Connected to Ganache on', GANACHE_RPC);

        // Read contract artifacts
        const batchTrackingArtifact = JSON.parse(
            fs.readFileSync(path.join(ARTIFACTS_PATH, 'BatchTracking.json'), 'utf8')
        );
        const supplyChainArtifact = JSON.parse(
            fs.readFileSync(path.join(ARTIFACTS_PATH, 'SupplyChainStatus.json'), 'utf8')
        );

        // Get deployed addresses from networks file if it exists
        const batchTrackingAddress = batchTrackingArtifact.networks['5777']?.address || 
                                     batchTrackingArtifact.networks['1337']?.address;
        const supplyChainAddress = supplyChainArtifact.networks['5777']?.address || 
                                   supplyChainArtifact.networks['1337']?.address;

        if (!batchTrackingAddress || !supplyChainAddress) {
            console.error('❌ Contract addresses not found in artifacts.');
            console.log('📍 Make sure to run: npx truffle migrate --network development --reset');
            process.exit(1);
        }

        console.log('\n📋 Extracted Addresses:');
        console.log('=======================');
        console.log('BatchTracking:    ', batchTrackingAddress);
        console.log('SupplyChainStatus:', supplyChainAddress);
        console.log('=======================\n');

        // Read current .env.local
        let envContent = fs.readFileSync(ENV_FILE, 'utf8');

        // Update addresses
        envContent = envContent.replace(
            /BATCH_TRACKING_ADDRESS=.*/,
            `BATCH_TRACKING_ADDRESS=${batchTrackingAddress}`
        );
        envContent = envContent.replace(
            /SUPPLY_CHAIN_ADDRESS=.*/,
            `SUPPLY_CHAIN_ADDRESS=${supplyChainAddress}`
        );

        // Ensure private key is set (Ganache default first account)
        if (!envContent.includes('BLOCKCHAIN_PRIVATE_KEY=0x')) {
            envContent = envContent.replace(
                /BLOCKCHAIN_PRIVATE_KEY=$/m,
                'BLOCKCHAIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
            );
        }

        // Write updated .env.local
        fs.writeFileSync(ENV_FILE, envContent);

        console.log('✅ Updated:', ENV_FILE);
        console.log('\n🔄 Now restart blockchain-service:');
        console.log('   cd server/blockchain-service');
        console.log('   npm start\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

extractAddresses();
