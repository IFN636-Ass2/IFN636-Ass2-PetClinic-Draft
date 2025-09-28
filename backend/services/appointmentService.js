const mongoose = require("mongoose");
const AppointmentModel = require("../models/Appointment");
const UserModel = require("../models/User");
const PetModel = require("../models/Pet");
const AppointmentEntity = require("../domain/AppointmentEntity");

class AppointmentService {
  // Create appointment
  async createAppointment(app) {
    // console.log(app)
    const entityApp = new AppointmentEntity(app);
    const createdApp = await AppointmentModel.create(entityApp.toObject());
    const [user, pet] = await Promise.all([UserModel.findOne({ _id: app.userId }).select("-password"), PetModel.findOne({ _id: app.petId })])

    return {
      ...createdApp.toObject(),
      userId: user,
      petId: pet
    };
  }

  // Get appointments
  async getAppointments(petId = null) {
    let apps;
    if (!petId) {
      apps = await AppointmentModel.find({}).populate({
        path: "userId",
        select: "-password"
      }).populate({
        path: "petId"
      }).lean();
    } else {
      apps = await AppointmentModel.find({ petId: petId }).populate({
        path: "userId",
        select: "-password"
      }).populate({
        path: "petId"
      }).lean();
    }
    if (!apps.length) throw new Error('No appointment exist. Please add new appointment.');
    // retrieve appoinments from db
    return apps;
  }

  // Update appointment
  async updateAppointment(id, newApp = {}) {
    const existApp = await AppointmentModel.findById(id).lean();
    if (!existApp) throw new Error('Appointment not found');

    // merge existInfo + newInfo
    const merged = {
      ...existApp,
      ...newApp,
      _id: existApp._id, // unchange id
    };

    // create PetEntity to validate merged data
    const entityApp = new AppointmentEntity(merged);

    // update pet in DB
    const updatedApp = await AppointmentModel.findByIdAndUpdate(
      id,
      entityApp.toObject(),
      { new: true, runValidators: true, overwrite: true }
    ).populate({
      path: "petId"
    }).lean();
    return updatedApp;
  }

  // DELETE
  async deleteAppointment(id) {
    const deleteApp = await AppointmentModel.findByIdAndDelete(id);
    if (!deleteApp) throw new Error("Appointment not found");
    return { message: "Appointment deleted" };
  }
}

module.exports = new AppointmentService();
