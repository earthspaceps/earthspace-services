const { Sequelize, DataTypes } = require('sequelize');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
    },
});

async function findAndTry() {
    try {
        const [customers] = await sequelize.query("SELECT id FROM users WHERE role = 'customer' LIMIT 1");
        if (!customers.length) {
            console.log('No customers found.');
            process.exit(1);
        }
        console.log('Found customer:', customers[0].id);

        // Test if we can find a service
        const [services] = await sequelize.query('SELECT id FROM services LIMIT 1');
        console.log('Found service:', services[0].id);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findAndTry();
