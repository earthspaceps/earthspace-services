const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBooking, updateBookingStatus, cancelBooking, assignTechnician, getPoolBookings, claimBooking } = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.post('/', authorize('customer'), createBooking);
router.get('/', getBookings);
router.get('/pool', authorize('technician'), getPoolBookings);
router.get('/:id', getBooking);
router.patch('/:id/status', authorize('technician', 'admin'), updateBookingStatus);
router.post('/:id/cancel', authorize('customer', 'admin'), cancelBooking);
router.post('/:id/assign', authorize('admin'), assignTechnician);
router.post('/:id/claim', authorize('technician'), claimBooking);


module.exports = router;
