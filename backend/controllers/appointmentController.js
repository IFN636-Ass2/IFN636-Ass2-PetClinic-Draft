const appointmentService = require("../services/appointmentService");
const { UserObserver, PetObserver, notifier } = require("../patterns/AppointmentObserver")
const { AdapterMail } = require("../patterns/AdapterEmail")


// Create appointment
createAppointment = async (req, res) => {
  try {
    const data = await appointmentService.createAppointment({ ...req.body, userId: req.user.id });
    // Observer use
    notifier.subscribe(new UserObserver(data.userId.name));
    notifier.subscribe(new PetObserver(data.petId.name));
    notifier.notify(JSON.stringify({
      type: 'APPOINTMENT_CREATED'
    }));
    // Adapter use
    const mailAdapter = new AdapterMail()
    await mailAdapter.sendEmail("quynhanhthao.161@gmail.com", "Subject", "Meow")
    res.status(201).json(data);
  } catch (error) { res.status(400).json({ message: error.message || 'Failed to create appointment' }); }
};

// Get appointments
getAppointments = async (req, res) => {
  const { petId } = req.query
  try {
    const data = await appointmentService.getAppointments(petId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment
updateAppointment = async (req, res) => {
  try {
    const data = await appointmentService.updateAppointment(req.params.id, req.body);
    res.json(data);
  } catch (error) { res.status(400).json({ message: error.message || 'Failed to update appointment' }); }
};

// Delete appointment
deleteAppointment = async (req, res) => {
  try {
    const data = await appointmentService.deleteAppointment(req.params.id);
    res.json(data);
  } catch (err) { res.status(400).json({ message: err?.message || 'Failed to delete appointment' }); }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
};

