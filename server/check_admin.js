const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAdminUser() {
    try {
        await client.connect();
        const res = await client.query('SELECT id, role, email FROM users WHERE name = $1', ['Earthspace Admin']);
        console.log('Admin User:', res.rows);
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkAdminUser();
