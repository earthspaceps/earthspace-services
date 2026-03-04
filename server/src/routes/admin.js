const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { Payment } = require('../models/Payment');
const Technician = require('../models/Technician');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// GET /api/admin/analytics
router.get('/analytics', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [totalUsers, totalTechnicians, totalBookings, monthlyBookings, totalRevenue, pendingBookings, completedBookings] = await Promise.all([
            User.count({ where: { role: 'customer' } }),
            Technician.count({ where: { status: 'verified' } }),
            Booking.count(),
            Booking.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
            Payment.sum('amount', { where: { status: 'completed' } }),
            Booking.count({ where: { status: ['pending', 'assigned', 'confirmed', 'on_the_way', 'started'] } }),
            Booking.count({ where: { status: 'completed' } }),
        ]);

        // Monthly bookings for last 6 months
        const monthlyStats = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            const count = await Booking.count({ where: { created_at: { [Op.gte]: start, [Op.lt]: end } } });
            const revenue = await Payment.sum('amount', { where: { status: 'completed', created_at: { [Op.gte]: start, [Op.lt]: end } } });
            monthlyStats.push({ month: d.toLocaleString('default', { month: 'short', year: '2-digit' }), bookings: count, revenue: parseFloat(revenue) || 0 });
        }

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalTechnicians,
                    totalBookings,
                    monthlyBookings,
                    totalRevenue: parseFloat(totalRevenue) || 0,
                    pendingBookings,
                    completedBookings
                },
                monthlyStats,
            }
        });
    } catch (err) {
        console.error('Analytics error:', err);
        next(err);
    }
});

// GET /api/admin/bookings/live
router.get('/bookings/live', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const liveBookings = await Booking.findAll({
            where: { status: { [Op.in]: ['pending', 'confirmed', 'assigned', 'on_the_way', 'started'] } },
            include: [
                { model: User, as: 'customer', attributes: ['name', 'phone'] },
                { model: Technician, as: 'technician', include: [{ model: User, as: 'user', attributes: ['name', 'phone'] }] },
            ],
            order: [['created_at', 'DESC']],
            limit: 50,
        });
        res.json({ success: true, data: { bookings: liveBookings } });
    } catch (err) { next(err); }
});

module.exports = router;
