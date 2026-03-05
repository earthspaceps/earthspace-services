const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), unique: true },
    phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING(255), field: 'password_hash' },
    role: { type: DataTypes.ENUM('customer', 'technician', 'admin'), defaultValue: 'customer' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    profileImageUrl: { type: DataTypes.TEXT, field: 'profile_image_url' },
    otpCode: { type: DataTypes.STRING(10), field: 'otp_code' },
    otpExpiresAt: { type: DataTypes.DATE, field: 'otp_expires_at' },
    walletBalance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, field: 'wallet_balance' },
    city: { type: DataTypes.STRING(100) },
    state: { type: DataTypes.STRING(100) },
    country: { type: DataTypes.STRING(100), defaultValue: 'India' },
    addressLine1: { type: DataTypes.TEXT, field: 'address_line1' },
    addressLine2: { type: DataTypes.TEXT, field: 'address_line2' },
    pincode: { type: DataTypes.STRING(10), field: 'pincode' },
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = User;
