/**
 * Notification Service - Earthspace Services
 * Stubs for Push, SMS, Email, WhatsApp notifications.
 * Replace stub implementations with real providers in production.
 */
const nodemailer = require('nodemailer');

// Email transporter (configure SMTP in .env)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

/**
 * Send push notification (stub - integrate Firebase FCM in production)
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
    console.log(`🔔 [PUSH] To: ${userId} | Title: ${title} | Body: ${body}`);
    // TODO: Integrate Firebase Admin SDK
    // await admin.messaging().send({ token: userFcmToken, notification: { title, body }, data });
};

/**
 * Send SMS via Twilio
 */
const sendSMS = async (phone, message) => {
    console.log(`📱 [SMS] To: ${phone} | Message: ${message}`);
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({ body: message, from: process.env.TWILIO_PHONE_NUMBER, to: phone });
        } catch (err) { console.error('SMS Error:', err.message); }
    }
};

/**
 * Send email via Nodemailer
 */
const sendEmail = async (to, subject, text, html) => {
    if (!to) return;
    console.log(`📧 [EMAIL] To: ${to} | Subject: ${subject}`);
    try {
        await transporter.sendMail({
            from: `"Earthspace Services" <${process.env.SMTP_USER}>`,
            to, subject, text, html: html || `<p>${text}</p>`,
        });
    } catch (err) { console.error('Email Error:', err.message); }
};

/**
 * Send WhatsApp message via Twilio WhatsApp
 */
const sendWhatsApp = async (phone, message) => {
    console.log(`💬 [WHATSAPP] To: ${phone} | Message: ${message}`);
    if (process.env.TWILIO_ACCOUNT_SID) {
        try {
            const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: message,
                from: process.env.WHATSAPP_FROM || 'whatsapp:+14155238886',
                to: `whatsapp:${phone}`,
            });
        } catch (err) { console.error('WhatsApp Error:', err.message); }
    }
};

/**
 * Unified notification dispatcher
 */
const sendNotification = async (userId, title, body, channel = 'push', phone = null, email = null) => {
    switch (channel) {
        case 'push': await sendPushNotification(userId, title, body); break;
        case 'sms': if (phone) await sendSMS(phone, body); break;
        case 'email': if (email) await sendEmail(email, title, body); break;
        case 'whatsapp': if (phone) await sendWhatsApp(phone, body); break;
        default: await sendPushNotification(userId, title, body);
    }
};

module.exports = { sendNotification, sendEmail, sendSMS, sendWhatsApp, sendPushNotification };
