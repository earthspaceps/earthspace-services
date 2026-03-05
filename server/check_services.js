const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkServices() {
    try {
        await client.connect();
        const res = await client.query('SELECT id, name FROM services LIMIT 5');
        console.log('Services in DB:');
        res.rows.forEach(r => console.log(`- ${r.name}: ${r.id}`));
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkServices();
