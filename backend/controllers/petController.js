const { PetService, TreatmentService } = require('../services/petService');
const { UserEntity } = require('../domain/UserEntity');
const { AdminOnlyProxy } = require('../patterns/AdminProxy');
const { UserFactory } = require('../patterns/UserFactory');

// Pet CRUD

// create pet
const createPet = async (req, res) => {
  try {
    const data = await PetService.createPet(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to create pet' }); }
};

// get all pets
const getPets = async (_req, res) => {
  try {
    const data = await PetService.getPets();
    res.json(Array.isArray(data) ? data : []);
  } catch (_err) { res.json([]); }
};

// get pet by id
const getPetById = async (req, res) => {
  try {
    const data = await PetService.getPetById(req.params.id);
    res.json(data);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to get pet' }); }
};

// update pet
const updatePet = async (req, res) => {
  try {
    const data = await PetService.updatePet(req.params.id, req.body);
    res.json(data);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to update pet' }); }
};

// delete pet
const deletePet = async (req, res) => {
  try {
    // use Proxy to enforce only admin can delete pet
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const actor = { id: req.user.id, role: req.user.role || 'staff' };
    const service = new AdminOnlyProxy(PetService, actor);
    const result = await service.deletePet(id);
    res.json(result);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to delete pet' }); }
};

// Treatment CRD

// add treatment to pet
const addTreatment = async (req, res) => {
  try {
    const treatment = { petId: req.params.id, ...req.body, userId: req.body.userId };
    console.log(treatment)
    const createdTreatment = await TreatmentService.createTreatment(treatment);
    res.status(201).json(createdTreatment);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to add treatment' }); }
};

// get treatments of pet
const getTreatments = async (req, res) => {
  try {
    const list = await TreatmentService.getTreatmentsByPet(req.params.id);
    res.json(Array.isArray(list) ? list : []);
  } catch (_err) { res.json([]); }
};

// delete treatment by id
const deleteTreatment = async (req, res) => {
  try {
    const { id: petId, treatId } = req.params;
    const actor = { id: req.user.id, role: req.user.role || 'staff' };
    const service = new AdminOnlyProxy(TreatmentService, actor);
    const result = await service.deleteTreatment(treatId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Failed to delete treatment' });
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  addTreatment,
  getTreatments,
  deleteTreatment
};  
