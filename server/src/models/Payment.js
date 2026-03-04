const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');
const Technician = require('./Technician');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, field: 'booking_id' },
    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id' },
    technicianId: { type: DataTypes.UUID, field: 'technician_id' },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    commissionRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 20.00, field: 'commission_rate' },
    commissionAmount: { type: DataTypes.DECIMAL(12, 2), field: 'commission_amount' },
    technicianPayout: { type: DataTypes.DECIMAL(12, 2), field: 'technician_payout' },
    method: { type: DataTypes.ENUM('online', 'cash', 'wallet'), defaultValue: 'cash' },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
    gatewayTransactionId: { type: DataTypes.STRING(255), field: 'gateway_transaction_id' },
    gatewayOrderId: { type: DataTypes.STRING(255), field: 'gateway_order_id' },
    gatewayResponse: { type: DataTypes.JSONB, field: 'gateway_response' },
    invoiceNumber: { type: DataTypes.STRING(50), unique: true, field: 'invoice_number' },
    paidAt: { type: DataTypes.DATE, field: 'paid_at' },
}, {
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Payment.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'booking_id' },
    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id' },
    technicianId: { type: DataTypes.UUID, allowNull: false, field: 'technician_id' },
    rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
    review: { type: DataTypes.TEXT },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_published' },
}, {
    tableName: 'ratings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

Rating.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Rating.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Rating.belongsTo(Technician, { foreignKey: 'technician_id', as: 'technician' });

module.exports = { Payment, Rating };
