const express = require('express');
const router = express.Router();
const { getCategories, getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', authenticate, authorize('admin'), createService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

module.exports = router;
