const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Technician = sequelize.define('Technician', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'user_id' },
    status: { type: DataTypes.ENUM('pending_verification', 'verified', 'suspended', 'inactive'), defaultValue: 'pending_verification' },
    specializations: { type: DataTypes.ARRAY(DataTypes.TEXT) },
    experienceYears: { type: DataTypes.INTEGER, defaultValue: 0, field: 'experience_years' },
    idProofUrl: { type: DataTypes.TEXT, field: 'id_proof_url' },
    certificateUrl: { type: DataTypes.TEXT, field: 'certificate_url' },
    bio: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.00 },
    totalJobs: { type: DataTypes.INTEGER, defaultValue: 0, field: 'total_jobs' },
    currentLat: { type: DataTypes.DECIMAL(10, 8), field: 'current_lat' },
    currentLng: { type: DataTypes.DECIMAL(11, 8), field: 'current_lng' },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_available' },
    commissionRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 20.00, field: 'commission_rate' },
    totalEarnings: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, field: 'total_earnings' },
    bankAccountNumber: { type: DataTypes.STRING(30), field: 'bank_account_number' },
    bankIfsc: { type: DataTypes.STRING(15), field: 'bank_ifsc' },
}, {
    tableName: 'technicians',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Technician.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Technician, { foreignKey: 'user_id', as: 'technicianProfile' });

module.exports = Technician;
