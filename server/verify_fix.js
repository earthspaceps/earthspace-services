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

async function verifyFix() {
    try {
        // fc359b61-0f63-4b52-beed-b9c82021dd7f is the Earthspace Admin
        const adminId = 'fc359b61-0f63-4b52-beed-b9c82021dd7f';
        const [services] = await sequelize.query('SELECT id FROM services LIMIT 1');

        const booking = await Booking.create({
            bookingNumber: 'FIXVERIFY' + Math.floor(Math.random() * 10000),
            customerId: adminId,
            serviceId: services[0].id,
            scheduledDate: '2026-03-12',
            scheduledTime: '14:00',
            addressSnapshot: { line1: 'Verification St' },
            serviceSnapshot: { name: 'Verified Service' },
            paymentMethod: 'cash',
            paymentStatus: 'pending'
        });

        console.log('Verification successful! Booking created:', booking.bookingNumber);
        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
}

verifyFix();
