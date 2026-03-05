const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const Technician = require('../models/Technician');
const User = require('../models/User');
const { Service } = require('../models/Service');
const { Payment } = require('../models/Payment');
const notificationService = require('../services/notificationService');

const generateBookingNumber = () => `ES${new Date().getFullYear()}${String(Math.floor(100000 + Math.random() * 900000))}`;

// POST /api/bookings
const createBooking = async (req, res, next) => {
    try {
        const { serviceId, scheduledDate, scheduledTime, address, specialInstructions, paymentMethod = 'cash' } = req.body;
        const customerId = req.user.id;

        // --- Validate required fields ---
        if (!serviceId) return res.status(400).json({ success: false, message: 'serviceId is required.' });
        if (!scheduledDate) return res.status(400).json({ success: false, message: 'scheduledDate is required.' });
        if (!scheduledTime) return res.status(400).json({ success: false, message: 'scheduledTime is required.' });
        if (!address || !address.line1 || !address.city) return res.status(400).json({ success: false, message: 'Address (line1 and city) is required.' });

        // --- Check service exists ---
        let service;
        try {
            service = await Service.findByPk(serviceId);
        } catch (dbErr) {
            console.error('[createBooking] Service lookup error:', dbErr);
            return res.status(500).json({ success: false, message: `Database error during service lookup: ${dbErr.message}` });
        }
        if (!service) {
            return res.status(404).json({ success: false, message: 'Requested service not found.' });
        }

        // --- Create booking ---
        let booking;
        try {
            booking = await Booking.create({
                bookingNumber: generateBookingNumber(),
                customerId,
                serviceId,
                status: 'pending',
                scheduledDate,
                scheduledTime,
                addressSnapshot: address,
                serviceSnapshot: { id: service.id, name: service.name, basePrice: service.basePrice, priceType: service.priceType },
                specialInstructions: specialInstructions || '',
                estimatedPrice: service.basePrice,
                estimatedDurationMinutes: service.durationMinutes || 60,
                paymentMethod,
                paymentStatus: 'pending'
            });
        } catch (createErr) {
            console.error('[createBooking] Booking.create error:', createErr);
            return res.status(500).json({ success: false, message: `Failed to create booking record: ${createErr.message}` });
        }

        // --- Auto-assign technician (non-critical, won't block booking) ---
        try {
            Technician.findOne({
                where: { status: 'verified', isAvailable: true },
                include: [{ model: User, as: 'user' }],
            }).then(async (availableTech) => {
                if (availableTech) {
                    await booking.update({ technicianId: availableTech.id, status: 'assigned' });
                    notificationService.sendNotification(availableTech.userId, 'New Job Assigned', `You have a new booking #${booking.bookingNumber}`, 'push').catch(() => { });
                }
            }).catch(e => console.error('[createBooking] Tech assignment async error:', e.message));
        } catch (techErr) {
            console.error('[createBooking] Technician assignment error (non-fatal):', techErr.message);
        }

        // --- Notify customer (non-critical, won-t block booking) ---
        try {
            User.findByPk(customerId).then(customer => {
                if (customer) {
                    notificationService.sendNotification(customerId, 'Booking Confirmed', `Your booking #${booking.bookingNumber} is confirmed!`, 'push').catch(() => { });
                    notificationService.sendEmail(customer.email, 'Booking Confirmation - Earthspace Services', `Your booking #${booking.bookingNumber} has been placed successfully.`).catch(() => { });
                }
            }).catch(e => console.error('[createBooking] Customer notify async error:', e.message));
        } catch (notifyErr) {
            console.error('[createBooking] Notification error (non-fatal):', notifyErr.message);
        }

        // Return plain object to avoid serialization issues
        res.status(201).json({ success: true, message: 'Booking created successfully.', data: { booking: booking.get({ plain: true }) } });

    } catch (err) {
        console.error('[createBooking] Unexpected error:', err);
        next(err);
    }
};

// GET /api/bookings (customer: own, admin: all)
const getBookings = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const where = {};
        if (req.user.role === 'customer') where.customerId = req.user.id;
        if (req.user.role === 'technician') {
            const tech = await Technician.findOne({ where: { userId: req.user.id } });
            if (tech) where.technicianId = tech.id;
        }
        if (status) where.status = status;

        const { count, rows } = await Booking.findAndCountAll({
            where,
            include: [
                { model: Service, as: 'service', attributes: ['name', 'slug', 'basePrice'] },
                { model: User, as: 'customer', attributes: ['name', 'phone', 'email'] },
                { model: Technician, as: 'technician', include: [{ model: User, as: 'user', attributes: ['name', 'phone'] }] },
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ success: true, data: { bookings: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) } });
    } catch (err) { next(err); }
};

// GET /api/bookings/:id
const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'customer', attributes: ['name', 'phone', 'email', 'profileImageUrl'] },
                { model: Technician, as: 'technician', include: [{ model: User, as: 'user', attributes: ['name', 'phone', 'profileImageUrl'] }] },
            ],
        });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        // Access control
        if (req.user.role === 'customer' && booking.customerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        res.json({ success: true, data: { booking } });
    } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
    try {
        const { status, workProofUrl } = req.body;
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        const updates = { status };
        if (status === 'started') updates.startedAt = new Date();
        if (status === 'completed') { updates.completedAt = new Date(); if (workProofUrl) updates.workProofUrl = workProofUrl; }

        await booking.update(updates);

        // Notify customer of status change
        const statusMessages = {
            on_the_way: 'Your technician is on the way!',
            started: 'Your service has started.',
            completed: 'Your service is completed! Please rate your experience.'
        };
        if (statusMessages[status]) {
            await notificationService.sendNotification(booking.customerId, 'Booking Update', statusMessages[status], 'push');
        }

        res.json({ success: true, message: `Booking status updated to ${status}.`, data: { booking } });
    } catch (err) { next(err); }
};

// POST /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        const cancellableStatuses = ['pending', 'confirmed', 'assigned'];
        if (!cancellableStatuses.includes(booking.status)) {
            return res.status(400).json({ success: false, message: 'Booking cannot be cancelled at this stage.' });
        }

        await booking.update({ status: 'cancelled', cancellationReason: reason, cancelledAt: new Date() });
        res.json({ success: true, message: 'Booking cancelled successfully.', data: { booking } });
    } catch (err) { next(err); }
};

// POST /api/bookings/:id/assign (admin only)
const assignTechnician = async (req, res, next) => {
    try {
        const { technicianId } = req.body;
        const booking = await Booking.findByPk(req.params.id);
        const tech = await Technician.findByPk(technicianId);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (!tech) return res.status(404).json({ success: false, message: 'Technician not found.' });

        await booking.update({ technicianId, status: 'assigned' });
        await notificationService.sendNotification(tech.userId, 'New Job Assigned', `Booking #${booking.bookingNumber} assigned to you.`, 'push');
        res.json({ success: true, message: 'Technician assigned.', data: { booking } });
    } catch (err) { next(err); }
};

// GET /api/bookings/pool (technicians only: unassigned jobs)
const getPoolBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { count, rows } = await Booking.findAndCountAll({
            where: { status: 'pending', technicianId: null },
            include: [
                { model: Service, as: 'service', attributes: ['name', 'slug', 'basePrice'] },
                { model: User, as: 'customer', attributes: ['name', 'phone', 'city'] },
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ success: true, data: { bookings: rows, total: count } });
    } catch (err) { next(err); }
};

// POST /api/bookings/:id/claim (technician only)
const claimBooking = async (req, res, next) => {
    try {
        const tech = await Technician.findOne({ where: { userId: req.user.id } });
        if (!tech) return res.status(404).json({ success: false, message: 'Technician profile not found.' });
        if (tech.status !== 'verified') return res.status(403).json({ success: false, message: 'Only verified technicians can claim jobs.' });

        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (booking.technicianId || booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Job is already assigned or taken.' });
        }

        await booking.update({ technicianId: tech.id, status: 'assigned' });

        // Notify customer
        await notificationService.sendNotification(booking.customerId, 'Technician Assigned', 'A professional has claimed your booking!', 'push');

        res.json({ success: true, message: 'Job claimed successfully.', data: { booking } });
    } catch (err) { next(err); }
};

module.exports = {
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking,
    assignTechnician,
    getPoolBookings,
    claimBooking
};

