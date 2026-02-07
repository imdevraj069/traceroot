const BASE_URL = 'http://localhost:8001/api/auth';

const users = [
    { name: 'Admin User', email: 'admin@traceroot.com', password: 'password123', role: 'admin' },
    { name: 'Supplier User', email: 'supplier@traceroot.com', password: 'password123', role: 'supplier' },
    { name: 'Manufacturer User', email: 'manufacturer@traceroot.com', password: 'password123', role: 'manufacturer' },
    { name: 'Distributor User', email: 'distributor@traceroot.com', password: 'password123', role: 'distributor' },
    { name: 'Retailer User', email: 'retailer@traceroot.com', password: 'password123', role: 'retailer' },
    { name: 'Consumer User', email: 'consumer@traceroot.com', password: 'password123', role: 'consumer' },
];

async function seedUsers() {
    console.log('🌱 Seeding default users...');

    for (const user of users) {
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`✅ Created ${user.role}: ${user.email}`);
            } else if (data.message && data.message.includes('already exists')) {
                console.log(`⚠️  ${user.role} already exists: ${user.email}`);
            } else {
                console.error(`❌ Failed to create ${user.role}: ${data.message}`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${user.role}: ${error.message}`);
        }
    }

    console.log('\n✨ Seeding complete! You can now login with these credentials.');
    console.log('Password for all users: password123');
}

seedUsers();
