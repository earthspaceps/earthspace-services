/**
 * Payment Service - Earthspace Services
 * Mock Razorpay integration. Replace with real SDK in production.
 */

const calculateCommission = (amount, commissionRate = 20) => {
    const commissionAmount = parseFloat(((amount * commissionRate) / 100).toFixed(2));
    const technicianPayout = parseFloat((amount - commissionAmount).toFixed(2));
    return { commissionAmount, technicianPayout };
};

const generateInvoiceNumber = () => `INV-ES-${Date.now()}`;

/**
 * Create payment order (mock Razorpay)
 */
const createOrder = async (amount, currency = 'INR', bookingId) => {
    console.log(`💳 [PAYMENT] Creating order: ₹${amount} for booking ${bookingId}`);

    // TODO: Replace with actual Razorpay SDK call:
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt: bookingId });

    // Mock response
    return {
        orderId: `order_mock_${Date.now()}`,
        amount: amount * 100, // paise
        currency,
        status: 'created',
    };
};

/**
 * Verify payment signature (mock)
 */
const verifyPayment = (orderId, paymentId, signature) => {
    console.log(`🔍 [PAYMENT] Verifying signature for order ${orderId}`);
    // TODO: Use Razorpay signature verification:
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    // return expectedSignature === signature;
    return true; // Mock success
};

/**
 * Process cash payment
 */
const processCashPayment = async (bookingId, amount, technicianId) => {
    const { commissionAmount, technicianPayout } = calculateCommission(amount);
    return {
        status: 'pending', // Cash collected physically, marked completed by admin
        commissionAmount,
        technicianPayout,
        invoiceNumber: generateInvoiceNumber(),
    };
};

/**
 * Process wallet payment
 */
const processWalletPayment = async (user, amount) => {
    if (user.walletBalance < amount) {
        throw { statusCode: 400, message: 'Insufficient wallet balance.' };
    }
    await user.update({ walletBalance: parseFloat(user.walletBalance) - amount });
    const { commissionAmount, technicianPayout } = calculateCommission(amount);
    return {
        status: 'completed',
        commissionAmount,
        technicianPayout,
        invoiceNumber: generateInvoiceNumber(),
        paidAt: new Date(),
    };
};

module.exports = { createOrder, verifyPayment, processCashPayment, processWalletPayment, calculateCommission, generateInvoiceNumber };
