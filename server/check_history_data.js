const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkData() {
    try {
        await client.connect();
        // Check bookings with technicians
        const res = await client.query(`
      SELECT b.id, b.status, b.payment_method, b.payment_status, b.service_snapshot,
             u.name as tech_name
      FROM bookings b
      LEFT JOIN technicians t ON b.technician_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY b.created_at DESC LIMIT 10
    `);

        console.log('Last 10 Bookings Data:');
        res.rows.forEach(r => {
            console.log(`- ID: ${r.id} | Status: ${r.status} | Tech: ${r.tech_name} | Subj: ${r.service_snapshot?.name} | PM: ${r.payment_method}`);
        });

        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkData();
