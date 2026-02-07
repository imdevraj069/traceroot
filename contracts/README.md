# TraceRoot Smart Contracts

Solidity smart contracts for the TraceRoot supply chain traceability platform.

## Prerequisites

- Node.js v18+
- Truffle: `npm install -g truffle`
- Ganache (GUI or CLI)

## Setup

```bash
# Install dependencies
npm install

# Start Ganache (CLI)
npx ganache --port 8545

# Or use Ganache GUI on port 7545
```

## Commands

```bash
# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Run tests
npm test

# Export ABIs to blockchain-service
npm run export:abi

# Open Truffle console
npm run console:dev
```

## Contracts

### BatchTracking.sol
Main contract for tracking product batches:
- Create batches with product info
- Add quality metrics
- NFC tag authentication
- Track batch history

### SupplyChainStatus.sol  
Status management contract:
- Update batch status (Created → Delivered)
- Track status history
- Calculate progress percentage

## Deployment

### Local (Ganache)
```bash
npm run deploy:local
```

### Export ABIs
After deployment, export ABIs for use in services:
```bash
npm run export:abi
```

This copies the ABI files to `server/blockchain-service/src/contracts/`.

## Network Configuration

Edit `truffle-config.js` to configure networks:
- `development`: Ganache CLI (port 8545)
- `ganache`: Ganache GUI (port 7545)
- `goerli`/`sepolia`: Testnets (requires Infura key)

## Testing

```bash
npm test
```

Tests cover:
- Batch creation and retrieval
- Quality metric recording
- NFC authentication validation
- Status updates and history
