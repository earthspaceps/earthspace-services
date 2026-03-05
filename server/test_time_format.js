const { Sequelize, DataTypes } = require('sequelize');
const DATABASE_URL = 'postgresql://postgres.xiimrqhyjrmuhkxdtkcf:MrSP%3F%25S3zkYk3LR@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
    },
});

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingNumber: { type: DataTypes.STRING(20), unique: true, field: 'booking_number' },
    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id' },
    serviceId: { type: DataTypes.UUID, allowNull: false, field: 'service_id' },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'scheduled_date' },
    scheduledTime: { type: DataTypes.TIME, allowNull: false, field: 'scheduled_time' },
}, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

async function createDummyBooking() {
    try {
        const [users] = await sequelize.query('SELECT id FROM users LIMIT 1');
        const [services] = await sequelize.query('SELECT id FROM services LIMIT 1');

        await Booking.create({
            bookingNumber: 'TEST_' + Date.now(),
            customerId: users[0].id,
            serviceId: services[0].id,
            scheduledDate: '2026-03-10',
            scheduledTime: '08:00', // Testing HH:MM instead of HH:MM:SS
        });

        console.log('Dummy booking created with HH:MM.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to create booking:', err);
        process.exit(1);
    }
}

createDummyBooking();
