const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findService() {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM services WHERE id = $1', ['7399bff3-6289-4660-8456-9a5c8c5c5c5c']);
        if (res.rows.length) {
            console.log('Service found:', res.rows[0]);
        } else {
            console.log('Service NOT found.');
        }
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

findService();
