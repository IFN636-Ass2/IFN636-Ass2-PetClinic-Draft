const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// GET: Retrieve all appointments for the authenticated user
// POST: Create a new appointment for the authenticated user
router.route('/').get(protect, getAppointments).post(protect, createAppointment);

// PUT: Update an existing appointment
// DELETE: Remove an existing appointment
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);

module.exports = router;
