const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkRecentBookings() {
    try {
        await client.connect();
        const res = await client.query('SELECT id, booking_number, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 3');
        console.log('Recent Bookings:');
        res.rows.forEach(r => console.log(`- ${r.booking_number} | Status: ${r.status} | Time: ${r.created_at}`));
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkRecentBookings();
