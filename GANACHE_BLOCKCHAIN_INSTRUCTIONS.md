# Ganache + Blockchain Local Setup

This guide explains how to start Ganache, deploy the contracts, and run the blockchain service locally.

## Prerequisites

- Node.js 18+ installed
- Ganache installed (GUI or CLI)

Install Ganache CLI (optional):

```
npm install -g ganache
```

## 1) Start Ganache

### Option A: Ganache GUI

1. Open Ganache
2. Create a new workspace (or use Quickstart)
3. Set RPC server to `http://127.0.0.1:8545`
4. Start the workspace

### Option B: Ganache CLI

```
ganache --port 8545 --chain.chainId 1337 --wallet.totalAccounts 10 --wallet.defaultBalance 1000
```

## 2) Deploy Contracts

From the `contracts` folder:

```
cd contracts
npm install
npx truffle migrate --network development --reset
```

This writes contract artifacts to `contracts/build/contracts`.

## 3) Export ABI (if needed)

If the frontend or services need ABI JSON files, run:

```
cd contracts
node scripts/export-abi.js
```

## 4) Run Blockchain Service

From the `server/blockchain-service` folder (if present):

```
cd server/blockchain-service
npm install
npm run dev
```

If your blockchain service is inside the `repo` folder:

```
cd repo
npm install
npm run dev
```

## 5) Verify It Works

- Ganache RPC: `http://127.0.0.1:8545`
- Check deployed contracts in the Ganache UI
- Check service logs for successful contract initialization

## Common Issues

- "Invalid network": Ensure `development` in `contracts/truffle-config.js` uses `host: 127.0.0.1`, `port: 8545`, `network_id: "*"`.
- "No deployed contracts": Re-run `npx truffle migrate --network development --reset`.
- "Connection refused": Ganache not running or wrong port.

## Environment Variables (Typical)

Set these in your `.env` if required:

```
NEXT_PUBLIC_BLOCKCHAIN_URL=http://localhost:8003
NEXT_PUBLIC_TRACE_URL=http://localhost:8002
NEXT_PUBLIC_AUTH_URL=http://localhost:8001
```
