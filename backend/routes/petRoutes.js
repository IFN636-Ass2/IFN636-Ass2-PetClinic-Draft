const express = require('express');
// const { protect } = require('../middleware/authMiddleware');
// const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  getTreatments,
  addTreatment,
  deleteTreatment
} = require('../controllers/petController');
const { Protect, AdminOnly } = require('../middleware/MiddlewareHandler');
const router = express.Router();


// Chain of responsibility
const protect = new Protect();
const adminOnly = new AdminOnly();
protect.setNext(adminOnly); // Protect -> AdminOnly

const protectOnly = (req, res, next) => new Protect().handle(req, res, next);
const protectAndAdmin = (req, res, next) => protect.handle(req, res, next);

// Pets
router.route('/')
  .get(protectOnly, getPets)
  .post(protectOnly, createPet);

router.route('/:id')
  .get(protectOnly, getPetById)
  .put(protectOnly, updatePet)
  .delete(protectAndAdmin, deletePet);

// Treatments
router.route('/:id/treatment')
  .get(protectOnly, getTreatments)
  .post(protectOnly, addTreatment);

router.route('/:id/treatment/:treatId')
  .delete(protectAndAdmin, deleteTreatment);

module.exports = router;
