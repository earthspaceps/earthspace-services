const { Op } = require('sequelize');
const { ServiceCategory, Service } = require('../models/Service');

// GET /api/services/categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await ServiceCategory.findAll({
            where: { isActive: true },
            include: [{ model: Service, as: 'services', where: { isActive: true }, required: false }],
            order: [['sort_order', 'ASC'], [{ model: Service, as: 'services' }, 'sort_order', 'ASC']],
        });
        res.json({ success: true, data: { categories } });
    } catch (err) { next(err); }
};

// GET /api/services
const getServices = async (req, res, next) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const where = { isActive: true };
        if (search) where.name = { [Op.iLike]: `%${search}%` };

        const include = [{ model: ServiceCategory, as: 'category', attributes: ['id', 'name', 'slug', 'iconName'] }];
        const categoryFilter = category ? { slug: category } : {};
        if (category) include[0].where = categoryFilter;

        const { count, rows } = await Service.findAndCountAll({
            where,
            include,
            order: [['sort_order', 'ASC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ success: true, data: { services: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) } });
    } catch (err) { next(err); }
};

// GET /api/services/:slug
const getService = async (req, res, next) => {
    try {
        const service = await Service.findOne({
            where: { slug: req.params.slug, isActive: true },
            include: [{ model: ServiceCategory, as: 'category' }],
        });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
        res.json({ success: true, data: { service } });
    } catch (err) { next(err); }
};

// POST /api/services (admin only)
const createService = async (req, res, next) => {
    try {
        const { categoryId, name, slug, description, basePrice, priceType, durationMinutes } = req.body;
        const service = await Service.create({ categoryId, name, slug, description, basePrice, priceType, durationMinutes });
        res.status(201).json({ success: true, message: 'Service created.', data: { service } });
    } catch (err) { next(err); }
};

// PUT /api/services/:id (admin only)
const updateService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
        await service.update(req.body);
        res.json({ success: true, message: 'Service updated.', data: { service } });
    } catch (err) { next(err); }
};

// DELETE /api/services/:id (admin only)
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
        await service.update({ isActive: false });
        res.json({ success: true, message: 'Service deactivated.' });
    } catch (err) { next(err); }
};

module.exports = { getCategories, getServices, getService, createService, updateService, deleteService };
