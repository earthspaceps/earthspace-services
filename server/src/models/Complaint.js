const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');

const Complaint = sequelize.define('Complaint', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'booking_id'
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'customer_id'
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'in_review', 'resolved', 'closed'),
        defaultValue: 'open'
    },
    adminResponse: {
        type: DataTypes.TEXT,
        field: 'admin_response'
    },
    resolvedAt: {
        type: DataTypes.DATE,
        field: 'resolved_at'
    }
}, {
    tableName: 'complaints',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Complaint.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Complaint.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

module.exports = Complaint;
