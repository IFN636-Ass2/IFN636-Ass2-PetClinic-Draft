class AdminOnlyProxy {
  constructor(service, actor) {
    this.service = service;
    this.actor = actor;
  }

  // only admin actor can delete pet
  async deletePet(id) {
    const isAdmin = this.actor.role === 'admin'
    if (!isAdmin) {
      const error = new Error('Only admin can delete.')
      error.status = 403;
      throw error;
    }
    return this.service.deletePet(id);
  }

  // only admin actor can delete treatment
  async deleteTreatment(id) {
    const isAdmin = this.actor.role === 'admin'
    if (!isAdmin) {
      const error = new Error('Only admin can delete.')
      error.status = 403;
      throw error;
    }
    return this.service.deleteTreatment(id);
  }

  // other methods are accessible to all roles
  async createPet(pet) { return this.service.createPet(pet); }
  async getPets() { return this.service.getPets(); }
  async getPetById(id) { return this.service.getPetById(id); }
  async updatePet(id, newInfo = {}) { return this.service.updatePet(id, newInfo); }
}

module.exports = { AdminOnlyProxy };
