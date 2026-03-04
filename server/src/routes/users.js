const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Technician = require('../models/Technician');
const Booking = require('../models/Booking');
const { Payment } = require('../models/Payment');

// GET /api/users/profile
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash', 'otpCode', 'otpExpiresAt'] } });
        res.json({ success: true, data: { user } });
    } catch (err) { next(err); }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req, res, next) => {
    try {
        const { name, email, city } = req.body;
        const user = await User.findByPk(req.user.id);
        await user.update({ name, email, city });
        res.json({ success: true, message: 'Profile updated.', data: { user } });
    } catch (err) { next(err); }
});

// GET /api/users (admin)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;
        const where = {};
        if (role) where.role = role;
        const { count, rows } = await User.findAndCountAll({
            where, attributes: { exclude: ['passwordHash', 'otpCode', 'otpExpiresAt'] },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ success: true, data: { users: rows, total: count } });
    } catch (err) { next(err); }
});

// PATCH /api/users/:id/toggle-status (admin)
router.patch('/:id/toggle-status', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        await user.update({ isActive: !user.isActive });
        res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.` });
    } catch (err) { next(err); }
});

// GET /api/users/technicians (admin)
router.get('/technicians', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;
        const technicians = await Technician.findAll({
            where, include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImageUrl', 'city'] }],
            order: [['created_at', 'DESC']],
        });
        res.json({ success: true, data: { technicians } });
    } catch (err) { next(err); }
});

// PATCH /api/users/technicians/:id/verify (admin)
router.patch('/technicians/:id/verify', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { status } = req.body; // verified, suspended, inactive
        const tech = await Technician.findByPk(req.params.id);
        if (!tech) return res.status(404).json({ success: false, message: 'Technician not found.' });
        await tech.update({ status });
        res.json({ success: true, message: `Technician status: ${status}` });
    } catch (err) { next(err); }
});

// GET /api/users/technician/dashboard (technician)
router.get('/technician/dashboard', authenticate, authorize('technician'), async (req, res, next) => {
    try {
        const tech = await Technician.findOne({ where: { userId: req.user.id } });
        if (!tech) return res.status(404).json({ success: false, message: 'Technician profile not found.' });

        const [pendingJobs, totalCompleted, recentJobs, totalEarnings] = await Promise.all([
            Booking.count({ where: { technicianId: tech.id, status: 'assigned' } }),
            Booking.count({ where: { technicianId: tech.id, status: 'completed' } }),
            Booking.findAll({
                where: { technicianId: tech.id },
                include: [{ model: Booking.associations.service.target, as: 'service', attributes: ['name'] }],
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            Payment.sum('technicianPayout', { where: { technicianId: tech.id, status: 'completed' } })
        ]);

        res.json({ success: true, data: { technician: tech, pendingJobs, totalCompleted, recentJobs, totalEarnings: parseFloat(totalEarnings) || 0 } });
    } catch (err) { next(err); }
});

// PATCH /api/users/technician/availability
router.patch('/technician/availability', authenticate, authorize('technician'), async (req, res, next) => {
    try {
        const { isAvailable, lat, lng } = req.body;
        const tech = await Technician.findOne({ where: { userId: req.user.id } });
        await tech.update({ isAvailable, currentLat: lat, currentLng: lng });
        res.json({ success: true, message: `Availability set to ${isAvailable}.`, data: { isAvailable: tech.isAvailable } });
    } catch (err) { next(err); }
});

module.exports = router;
