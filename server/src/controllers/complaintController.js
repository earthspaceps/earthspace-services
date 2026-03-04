const Complaint = require('../models/Complaint');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createComplaint = async (req, res, next) => {
    try {
        const { bookingId, subject, description } = req.body;

        const complaint = await Complaint.create({
            customerId: req.user.id,
            bookingId,
            subject,
            description
        });

        res.status(201).json({
            success: true,
            data: { complaint }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.findAll({
            where: { customerId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: { complaints }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.findAll({
            include: [
                { model: User, as: 'customer', attributes: ['name', 'phone'] },
                { model: Booking, as: 'booking', attributes: ['bookingNumber'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: { complaints }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateComplaintStatus = async (req, res, next) => {
    try {
        const { status, adminResponse } = req.body;
        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        if (status) complaint.status = status;
        if (adminResponse) complaint.adminResponse = adminResponse;
        if (status === 'resolved') complaint.resolvedAt = new Date();

        await complaint.save();

        res.status(200).json({
            success: true,
            data: { complaint }
        });
    } catch (error) {
        next(error);
    }
};
