const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Technician = require('../models/Technician');

const generateTokens = (user) => {
    const payload = { id: user.id, role: user.role, name: user.name };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
    return { accessToken, refreshToken };
};

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { otp, expiresAt };
};

// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        let { name, email, phone, password, role = 'customer' } = req.body;
        if (email) email = email.toLowerCase().trim();
        if (password) password = password.trim();

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required.' });
        }

        const existing = await User.findOne({ where: { phone } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Phone number is already registered.' });
        }

        const passwordHash = password ? await bcrypt.hash(password, 12) : null;
        const allowedRoles = ['customer', 'technician'];
        const userRole = allowedRoles.includes(role) ? role : 'customer';

        const user = await User.create({ name, email, phone, passwordHash, role: userRole });

        // If registering as tech, create technician profile with extra details
        if (userRole === 'technician') {
            const { specializations, experienceYears, bio, idProofUrl } = req.body;
            await Technician.create({
                userId: user.id,
                specializations: Array.isArray(specializations) ? specializations : (specializations ? [specializations] : []),
                experienceYears: parseInt(experienceYears) || 0,
                bio: bio || '',
                idProofUrl: idProofUrl || '',
                status: 'pending_verification'
            });
        }


        const { accessToken, refreshToken } = generateTokens(user);
        res.status(201).json({
            success: true,
            message: 'Registration successful.',
            data: { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, accessToken, refreshToken }
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        let { phone, email, password } = req.body;
        if (email) email = email.toLowerCase().trim();
        if (password) password = password.trim();
        console.log(`[AUTH] Login attempt: email=${email}, phone=${phone}`);

        const where = phone ? { phone } : { email };
        const user = await User.findOne({ where });

        if (!user) {
            console.log(`[AUTH] User not found for: email=${email}, phone=${phone}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        console.log(`[AUTH] User found: id=${user.id}, role=${user.role}, isActive=${user.isActive}`);

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
        }
        if (password && user.passwordHash) {
            const valid = await bcrypt.compare(password, user.passwordHash);
            console.log(`[AUTH] Password comparison result: ${valid}`);
            if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        } else {
            console.log(`[AUTH] Password check skipped: password provided=${!!password}, passwordHash exists=${!!user.passwordHash}`);
        }

        const { accessToken, refreshToken } = generateTokens(user);
        console.log(`[AUTH] Login success: ${user.email || user.phone}`);
        res.json({
            success: true,
            message: 'Login successful.',
            data: { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, accessToken, refreshToken }
        });
    } catch (err) {
        console.error('[AUTH] Login Error:', err);
        next(err);
    }
};


// POST /api/auth/send-otp
const sendOTP = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: 'Phone number required.' });

        const { otp, expiresAt } = generateOTP();
        let user = await User.findOne({ where: { phone } });

        if (!user) {
            user = await User.create({ name: 'New User', phone });
        }

        await user.update({ otpCode: otp, otpExpiresAt: expiresAt });

        // In production: send OTP via SMS (Twilio)
        console.log(`📱 OTP for ${phone}: ${otp}`);

        res.json({ success: true, message: 'OTP sent successfully.', ...(process.env.NODE_ENV === 'development' && { otp }) });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required.' });

        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (user.otpCode !== otp) return res.status(401).json({ success: false, message: 'Invalid OTP.' });
        if (new Date() > user.otpExpiresAt) return res.status(401).json({ success: false, message: 'OTP expired.' });

        await user.update({ otpCode: null, otpExpiresAt: null });
        const { accessToken, refreshToken } = generateTokens(user);

        res.json({
            success: true,
            message: 'OTP verified successfully.',
            data: { user: { id: user.id, name: user.name, phone: user.phone, role: user.role }, accessToken, refreshToken }
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['passwordHash', 'otpCode', 'otpExpiresAt'] }
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, data: { user } });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, sendOTP, verifyOTP, getMe };
