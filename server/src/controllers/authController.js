const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const User = require('../models/User');
const Technician = require('../models/Technician');

// In-memory OTP attempt tracker (use Redis in production for distributed systems)
const otpAttempts = new Map();
const MAX_OTP_ATTEMPTS = 5;
const OTP_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const getOtpAttemptKey = (phone) => `otp_attempts:${phone}`;

const checkAndIncrementOtpAttempts = (phone) => {
    const key = getOtpAttemptKey(phone);
    const now = Date.now();
    const record = otpAttempts.get(key);
    if (record && now - record.firstAttempt < OTP_ATTEMPT_WINDOW_MS) {
        if (record.count >= MAX_OTP_ATTEMPTS) return false; // locked out
        record.count++;
    } else {
        otpAttempts.set(key, { count: 1, firstAttempt: now });
    }
    return true;
};

const clearOtpAttempts = (phone) => otpAttempts.delete(getOtpAttemptKey(phone));

// Constant-time string comparison to prevent timing attacks
const safeCompare = (a, b) => {
    try {
        return crypto.timingSafeEqual(Buffer.from(String(a)), Buffer.from(String(b)));
    } catch { return false; }
};

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
        if (user.passwordHash) {
            if (!password) {
                console.log(`[AUTH] Login failed: Password required but missing`);
                return res.status(401).json({ success: false, message: 'Password is required.' });
            }
            const valid = await bcrypt.compare(password, user.passwordHash);
            console.log(`[AUTH] Password comparison result: ${valid}`);
            if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        } else if (!user.passwordHash && password) {
            // User registered via OTP only, no password set
            return res.status(401).json({ success: false, message: 'No password set. Please login using OTP.' });
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

        // Throttle OTP sends: max 3 per 15 minutes
        const sendKey = `otp_send:${phone}`;
        const sendRecord = otpAttempts.get(sendKey);
        const now = Date.now();
        if (sendRecord && now - sendRecord.firstAttempt < OTP_ATTEMPT_WINDOW_MS && sendRecord.count >= 3) {
            return res.status(429).json({ success: false, message: 'Too many OTP requests. Please wait 15 minutes and try again.' });
        }
        if (sendRecord && now - sendRecord.firstAttempt < OTP_ATTEMPT_WINDOW_MS) {
            sendRecord.count++;
        } else {
            otpAttempts.set(sendKey, { count: 1, firstAttempt: now });
        }

        const { otp, expiresAt } = generateOTP();
        let user = await User.findOne({ where: { phone } });
        if (!user) {
            user = await User.create({ name: 'New User', phone });
        }
        await user.update({ otpCode: otp, otpExpiresAt: expiresAt });

        // In production: send OTP via SMS (Twilio). OTP is NEVER returned to client in production.
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📱 OTP for ${phone}: ${otp}`);
        }

        // Anti-enumeration: always return same success message regardless of whether phone exists
        res.json({ success: true, message: 'If this number is registered, an OTP has been sent.' });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required.' });

        // Brute force protection
        if (!checkAndIncrementOtpAttempts(phone)) {
            return res.status(429).json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' });
        }

        const user = await User.findOne({ where: { phone } });
        // Anti-enumeration: use same error for 'not found' and 'invalid OTP'
        if (!user || !user.otpCode) return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
        if (new Date() > user.otpExpiresAt) return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });

        // Constant-time comparison to prevent timing attacks
        if (!safeCompare(user.otpCode, otp)) {
            return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // OTP is valid — clear it and log in
        clearOtpAttempts(phone);
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
