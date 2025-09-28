class AppointmentEntity {
  // constructor
  constructor({_id = null, userId, petId, date, description = ""}) {

    // validate required fields
    if (!userId || !petId || !date) {
      throw new Error("userId, petId, date are required");
    }

    // validate date
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid date");

    this._id = _id;
    this.userId = String(userId);
    this.petId = String(petId);
    this.date = d;
    this.description = String(description || "").trim();
  }

  // methods
  reschedule(newDate) {
    const d = new Date(newDate);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
    this.date = d;
  }
  setDescription(desc) {
    this.description = String(desc || "").trim();
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      petId: this.petId,
      date: this.date,
      description: this.description
    };
  }
}

module.exports = AppointmentEntity;
