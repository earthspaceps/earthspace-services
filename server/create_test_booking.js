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
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'scheduled_date' },
    scheduledTime: { type: DataTypes.TIME, allowNull: false, field: 'scheduled_time' },
    addressSnapshot: { type: DataTypes.JSONB, field: 'address_snapshot' },
    serviceSnapshot: { type: DataTypes.JSONB, field: 'service_snapshot' },
    paymentMethod: { type: DataTypes.STRING, field: 'payment_method' },
    paymentStatus: { type: DataTypes.STRING, field: 'payment_status' },
}, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

async function createDummyBooking() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // Get a valid customer and service ID
        const [users] = await sequelize.query('SELECT id FROM users LIMIT 1');
        const [services] = await sequelize.query('SELECT id FROM services LIMIT 1');

        if (!users.length || !services.length) {
            console.log('No users or services found to link to.');
            process.exit(1);
        }

        const booking = await Booking.create({
            bookingNumber: 'TEST' + Math.floor(Math.random() * 1000000),
            customerId: users[0].id,
            serviceId: services[0].id,
            scheduledDate: '2026-03-10',
            scheduledTime: '10:00:00',
            addressSnapshot: { line1: 'Test St', city: 'Test City' },
            serviceSnapshot: { name: 'Test Service' },
            paymentMethod: 'cash',
            paymentStatus: 'pending'
        });

        console.log('Dummy booking created:', booking.bookingNumber);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create booking:', err);
        process.exit(1);
    }
}

createDummyBooking();
