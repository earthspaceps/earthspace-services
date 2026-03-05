const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkServiceInBooking() {
    try {
        await client.connect();
        const res = await client.query('SELECT service_id, service_snapshot FROM bookings ORDER BY created_at DESC LIMIT 1');
        if (res.rows.length) {
            console.log('Last Booking Service ID:', res.rows[0].service_id);
            console.log('Snapshot:', res.rows[0].service_snapshot);
        }
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkServiceInBooking();
