const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceCategory = sequelize.define('ServiceCategory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
    iconName: { type: DataTypes.STRING(50), field: 'icon_name' },
    imageUrl: { type: DataTypes.TEXT, field: 'image_url' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
}, {
    tableName: 'service_categories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

const Service = sequelize.define('Service', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    categoryId: { type: DataTypes.UUID, allowNull: false, references: { model: 'service_categories', key: 'id' }, field: 'category_id' },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(150), unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
    basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'base_price' },
    priceType: { type: DataTypes.STRING(20), defaultValue: 'fixed', field: 'price_type' },
    durationMinutes: { type: DataTypes.INTEGER, defaultValue: 60, field: 'duration_minutes' },
    imageUrl: { type: DataTypes.TEXT, field: 'image_url' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
}, {
    tableName: 'services',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ServiceCategory.hasMany(Service, { foreignKey: 'category_id', as: 'services' });
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = { ServiceCategory, Service };
