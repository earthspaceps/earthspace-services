const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        await client.connect();
        console.log('Connected to DB.');
        const res = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'bookings'
    `);
        console.log('Columns in bookings table:');
        res.rows.forEach(c => console.log(`- ${c.column_name} (${c.data_type}) | Nullable: ${c.is_nullable}`));
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

checkSchema();
