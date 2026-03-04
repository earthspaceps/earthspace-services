const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
    .get(authorize('admin'), complaintController.getAllComplaints)
    .post(authorize('customer'), complaintController.createComplaint);

router.get('/my', authorize('customer'), complaintController.getMyComplaints);

router.patch('/:id/status', authorize('admin'), complaintController.updateComplaintStatus);

module.exports = router;
