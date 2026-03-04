const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Technician = require('./Technician');
const { Service } = require('./Service');

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingNumber: { type: DataTypes.STRING(20), unique: true, field: 'booking_number' },
    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id' },
    technicianId: { type: DataTypes.UUID, field: 'technician_id' },
    serviceId: { type: DataTypes.UUID, allowNull: false, field: 'service_id' },
    addressId: { type: DataTypes.UUID, field: 'address_id' },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'assigned', 'on_the_way', 'started', 'completed', 'cancelled', 'rescheduled'),
        defaultValue: 'pending'
    },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'scheduled_date' },
    scheduledTime: { type: DataTypes.TIME, allowNull: false, field: 'scheduled_time' },
    estimatedDurationMinutes: { type: DataTypes.INTEGER, field: 'estimated_duration_minutes' },
    addressSnapshot: { type: DataTypes.JSONB, field: 'address_snapshot' },
    serviceSnapshot: { type: DataTypes.JSONB, field: 'service_snapshot' },
    specialInstructions: { type: DataTypes.TEXT, field: 'special_instructions' },
    estimatedPrice: { type: DataTypes.DECIMAL(10, 2), field: 'estimated_price' },
    finalPrice: { type: DataTypes.DECIMAL(10, 2), field: 'final_price' },
    paymentMethod: { type: DataTypes.ENUM('online', 'cash', 'wallet'), defaultValue: 'cash', field: 'payment_method' },
    paymentStatus: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending', field: 'payment_status' },
    cancellationReason: { type: DataTypes.TEXT, field: 'cancellation_reason' },
    cancelledAt: { type: DataTypes.DATE, field: 'cancelled_at' },
    startedAt: { type: DataTypes.DATE, field: 'started_at' },
    completedAt: { type: DataTypes.DATE, field: 'completed_at' },
    workProofUrl: { type: DataTypes.TEXT, field: 'work_proof_url' },
    adminNotes: { type: DataTypes.TEXT, field: 'admin_notes' },
}, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Booking.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Booking.belongsTo(Technician, { foreignKey: 'technician_id', as: 'technician' });
Booking.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = Booking;
