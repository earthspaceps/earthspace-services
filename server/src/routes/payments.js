const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { Payment, Rating } = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Technician = require('../models/Technician');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');

// POST /api/payments/initiate
router.post('/initiate', authenticate, authorize('customer'), async (req, res, next) => {
    try {
        const { bookingId, method } = req.body;
        const booking = await Booking.findByPk(bookingId);
        if (!booking || booking.customerId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        const amount = parseFloat(booking.finalPrice || booking.estimatedPrice);
        const tech = booking.technicianId ? await Technician.findByPk(booking.technicianId) : null;
        const { commissionAmount, technicianPayout } = paymentService.calculateCommission(amount, tech?.commissionRate || 20);
        const invoiceNumber = paymentService.generateInvoiceNumber();

        let paymentData = {};
        if (method === 'online') {
            // Online payments are disabled per user request
            return res.status(400).json({ success: false, message: 'Online payments are currently disabled.' });
        } else if (method === 'wallet') {
            const userRecord = await User.findByPk(req.user.id);
            paymentData = await paymentService.processWalletPayment(userRecord, amount);
        } else {
            paymentData = await paymentService.processCashPayment(bookingId, amount, booking.technicianId);
        }

        const payment = await Payment.create({
            bookingId, customerId: req.user.id, technicianId: booking.technicianId,
            amount, commissionAmount, technicianPayout, commissionRate: tech?.commissionRate || 20,
            method, invoiceNumber, ...paymentData,
        });

        res.status(201).json({ success: true, message: 'Payment initiated.', data: { payment } });
    } catch (err) { next(err); }
});

// POST /api/payments/verify
router.post('/verify', authenticate, async (req, res, next) => {
    try {
        const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) return res.status(400).json({ success: false, message: 'Payment verification failed.' });

        const payment = await Payment.findByPk(paymentId);
        await payment.update({ status: 'completed', gatewayTransactionId: razorpayPaymentId, paidAt: new Date() });

        // Update booking to completed
        await Booking.update({ status: 'completed' }, { where: { id: payment.bookingId } });

        // send receipt email
        const customer = await User.findByPk(payment.customerId);
        await notificationService.sendEmail(customer.email, 'Payment Receipt - Earthspace Services', `Payment of ₹${payment.amount} received. Invoice: ${payment.invoiceNumber}`);

        res.json({ success: true, message: 'Payment verified and confirmed.', data: { payment } });
    } catch (err) { next(err); }
});

// GET /api/payments (admin)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = status ? { status } : {};
        const { count, rows } = await Payment.findAndCountAll({
            where,
            include: [{ model: Booking, as: 'booking', attributes: ['bookingNumber', 'scheduledDate'] },
            { model: User, as: 'customer', attributes: ['name', 'phone'] }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ success: true, data: { payments: rows, total: count } });
    } catch (err) { next(err); }
});

// POST /api/payments/:bookingId/collect-cash (technician confirms receipt)
router.post('/:bookingId/collect-cash', authenticate, authorize('technician'), async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        // Verify this booking belongs to this technician
        const tech = await Technician.findOne({ where: { userId: req.user.id } });
        if (!tech || booking.technicianId !== tech.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized. This job is not assigned to you.' });
        }

        const payment = await Payment.findOne({ where: { bookingId, method: 'cash' } });
        if (!payment) return res.status(404).json({ success: false, message: 'Cash payment record not found for this booking.' });

        if (payment.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Payment already marked as completed.' });
        }

        // Update payment status
        await payment.update({
            status: 'completed',
            paidAt: new Date(),
            gatewayTransactionId: `CASH_COLLECTED_${tech.id}_${Date.now()}`
        });

        // Update booking status if completed
        const bookingUpdates = { paymentStatus: 'completed' };
        if (booking.status === 'started' || booking.status === 'on_the_way') {
            bookingUpdates.status = 'completed';
            bookingUpdates.completedAt = new Date();
        }
        await booking.update(bookingUpdates);

        res.json({ success: true, message: 'Payment confirmed and booking marked as completed.', data: { payment } });
    } catch (err) { next(err); }
});

// POST /api/ratings
router.post('/ratings', authenticate, authorize('customer'), async (req, res, next) => {
    try {
        const { bookingId, rating, review } = req.body;
        const booking = await Booking.findByPk(bookingId);
        if (!booking || booking.customerId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        if (booking.status !== 'completed') return res.status(400).json({ success: false, message: 'Can only rate completed bookings.' });

        const ratingRecord = await Rating.create({
            bookingId, customerId: req.user.id, technicianId: booking.technicianId, rating, review,
        });

        // Update technician average rating
        if (booking.technicianId) {
            const allRatings = await Rating.findAll({ where: { technicianId: booking.technicianId } });
            const avg = allRatings.reduce((a, r) => a + parseFloat(r.rating), 0) / allRatings.length;
            const Technician = require('../models/Technician');
            await Technician.update({ rating: avg.toFixed(2) }, { where: { id: booking.technicianId } });
        }

        res.status(201).json({ success: true, message: 'Rating submitted. Thank you!', data: { rating: ratingRecord } });
    } catch (err) { next(err); }
});

module.exports = router;
