const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkBookingUser() {
    try {
        await client.connect();
        const res = await client.query('SELECT customer_id FROM bookings ORDER BY created_at DESC LIMIT 1');
        if (res.rows.length) {
            console.log('Last Booking Customer ID:', res.rows[0].customer_id);
            const userRes = await client.query('SELECT name FROM users WHERE id = $1', [res.rows[0].customer_id]);
            if (userRes.rows.length) {
                console.log('Customer Name:', userRes.rows[0].name);
            }
        }
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkBookingUser();
