/**
 * Booking endpoint diagnostic tool
 * Run: node test_booking.js
 */
require('dotenv').config();
const axios = require('axios');

const BASE = process.env.TEST_API_URL || 'https://earthspace-api.onrender.com';

async function run() {
    console.log('🔍 Testing Earthspace Booking API...');
    console.log('🌐 Server:', BASE, '\n');

    // Step 1: Login as customer
    let token;
    try {
        const loginRes = await axios.post(`${BASE}/api/auth/login`, {
            phone: process.env.TEST_PHONE || '+919876543210',
            password: process.env.TEST_PASS || 'admin123'
        });
        token = loginRes.data?.data?.accessToken || loginRes.data?.token;
        console.log('✅ Login OK. Token received:', token ? 'YES' : 'NO');
    } catch (e) {
        console.error('❌ Login failed:', e.response?.data || e.message);
        // Try email login as fallback
        try {
            const loginRes2 = await axios.post(`${BASE}/api/auth/login`, {
                email: 'customer@test.com',
                password: 'admin123'
            });
            token = loginRes2.data?.data?.accessToken || loginRes2.data?.token;
            console.log('✅ Email Login OK. Token received:', token ? 'YES' : 'NO');
        } catch (e2) {
            console.error('❌ Email Login also failed:', e2.response?.data || e2.message);
            return;
        }
    }

    // Step 2: Get first available service
    let serviceId;
    try {
        const svcRes = await axios.get(`${BASE}/api/services`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const services = svcRes.data?.data?.services || svcRes.data?.services || [];
        serviceId = services[0]?.id;
        console.log(`✅ Services OK. First service: ${services[0]?.name} (${serviceId})`);
    } catch (e) {
        console.error('❌ Services fetch failed:', e.response?.data || e.message);
        return;
    }

    if (!serviceId) {
        console.error('❌ No services found in DB! Cannot test booking.');
        return;
    }

    // Step 3: Create Booking
    try {
        const res = await axios.post(`${BASE}/api/bookings`, {
            serviceId,
            scheduledDate: '2026-03-15',
            scheduledTime: '10:00',
            address: { line1: '123 Test Street', line2: '', city: 'Mumbai', pincode: '400001' },
            specialInstructions: '',
            paymentMethod: 'cash'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('\n✅ BOOKING SUCCESS!');
        console.log('Status:', res.status);
        console.log('Response:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('\n❌ BOOKING FAILED!');
        console.error('HTTP Status:', e.response?.status);
        console.error('Error Response:', JSON.stringify(e.response?.data, null, 2));
        console.error('Raw Error:', e.message);
    }
}

run();
