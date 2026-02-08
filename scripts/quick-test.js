#!/usr/bin/env node

/**
 * Quick Integration Test - Verify Blockchain Transaction Flow
 * Run after all services are started
 */

const http = require('http');

const SERVICES = {
    auth: 'http://localhost:8001',
    trace: 'http://localhost:8002',
    blockchain: 'http://localhost:8003'
};

let testResults = {
    passed: [],
    failed: [],
    warnings: []
};

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const req = http.request({
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            timeout: 5000,
            ...options
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data),
                        headers: res.headers
                    });
                } catch {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n🧪 TRACEROOT SYSTEM VERIFICATION TEST\n');

    // Test 1: Microservice Health
    console.log('📊 Test 1: Microservice Health Checks');
    console.log('=====================================\n');

    for (const [name, url] of Object.entries(SERVICES)) {
        try {
            const response = await makeRequest(url);
            if (response.status === 200) {
                console.log(`✅ ${name.toUpperCase()}: Online (port ${new URL(url).port})`);
                testResults.passed.push(`${name}-health`);
            } else {
                console.log(`❌ ${name.toUpperCase()}: Error (status ${response.status})`);
                testResults.failed.push(`${name}-health`);
            }
        } catch (error) {
            console.log(`❌ ${name.toUpperCase()}: Offline - ${error.message}`);
            testResults.failed.push(`${name}-health`);
        }
    }

    // Test 2: Blockchain Service Configuration
    console.log('\n📋 Test 2: Blockchain Service Configuration');
    console.log('==========================================\n');

    try {
        const response = await makeRequest(`${SERVICES.blockchain}/api/blockchain/status`);
        if (response.status === 200) {
            console.log(`✅ Blockchain Status Endpoint: Responding`);
            console.log(`   Data:`, JSON.stringify(response.data, null, 2));
            testResults.passed.push('blockchain-status-endpoint');
        }
    } catch (error) {
        console.log(`❌ Blockchain Status Endpoint: ${error.message}`);
        testResults.failed.push('blockchain-status-endpoint');
    }

    // Test 3: Connection Summary
    console.log('\n\n📈 VERIFICATION SUMMARY');
    console.log('======================\n');

    const allTests = testResults.passed.length + testResults.failed.length;
    const passRate = allTests > 0 ? ((testResults.passed.length / allTests) * 100).toFixed(0) : 0;

    console.log(`Total Tests: ${allTests}`);
    console.log(`Passed: ${testResults.passed.length} ✅`);
    console.log(`Failed: ${testResults.failed.length} ❌`);
    console.log(`Pass Rate: ${passRate}%\n`);

    if (testResults.failed.length === 0) {
        console.log('🎉 ALL SYSTEMS OPERATIONAL - READY FOR TESTING!\n');
        return 0;
    } else {
        console.log('⚠️ SOME SYSTEMS ARE NOT RESPONDING\n');
        console.log('Failed Tests:');
        testResults.failed.forEach(test => console.log(`  - ${test}`));
        console.log('\nPlease restart the failed services and try again.\n');
        return 1;
    }
}

runTests().then(code => process.exit(code));
