module.exports = {
    // Truffle configuration for TraceRoot supply chain contracts
    networks: {
        // Local Ganache network
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 6721975,
            gasPrice: 20000000000, // 20 gwei
        },

        // Ganache GUI (if using different port)
        ganache: {
            host: "127.0.0.1",
            port: 7545,
            network_id: 5777,
            gas: 6721975,
            gasPrice: 20000000000,
        },

        // For testing
        test: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },

        // Goerli testnet (for future deployment)
        goerli: {
            // provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/${infuraKey}`),
            network_id: 5,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },

        // Sepolia testnet
        sepolia: {
            // provider: () => new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/${infuraKey}`),
            network_id: 11155111,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    },

    // Compiler configuration
    compilers: {
        solc: {
            version: "0.8.19",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "paris"
            }
        }
    },

    // Directory configuration
    contracts_directory: "./contracts",
    contracts_build_directory: "./build/contracts",
    migrations_directory: "./migrations",

    // Plugin configuration
    plugins: [],

    // Mocha testing configuration
    mocha: {
        timeout: 100000
    }
};
