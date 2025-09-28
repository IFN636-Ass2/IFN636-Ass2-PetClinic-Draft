class PetEntity {
  #id; #name; #owner; // encapsulation

  // constructor
  constructor({ _id = null, name, age = null, gender = null, species, breed = null, owner }) {
    // validate required fields
    if (!name || !species || !owner?.name || !owner?.phone) {
      throw new Error("Pet: name, species, owner name, owner phone are required");
    }
    // encapsulated state with private fields id, name, owner
    this.#id = _id;
    this.#name = String(name).trim();
    this.age = Number(age) >= 0 ? Number(age) : null;
    this.gender = String(gender).trim() || null;
    this.species = String(species).trim();
    this.breed = String(breed).trim() || null;
    this.#owner = {
      name: String(owner.name).trim(),
      phone: String(owner.phone).trim(),
      email: String(owner.email).trim() || null
    };
  }

  // getters
  get id() { return this.#id; }
  get name() { return this.#name; }
  get owner() { return { ...this.#owner }; }

  // methods
  // update new name for pet
  rename(newName) {
    const name = String(newName ?? '').trim(); // check null
    if (!name) throw new Error('Pet: name cannot be empty');
    this.#name = name;
  }

  // update owner info
  changeOwner({ name, phone, email }) {
    const ownerName = String(name ?? '').trim(); // check null
    const ownerPhone = String(phone ?? '').trim(); // check null
    if (!ownerName || !ownerPhone) throw new Error("Owner name & phone are required");
    const ownerEmail = String(email).trim()
    this.#owner = { name: ownerName, phone: ownerPhone, email: ownerEmail };
  }

  // mapping
  toObject() {
    return {
      _id: this.#id,
      name: this.#name,
      age: this.age,
      gender: this.gender,
      species: this.species,
      breed: this.breed,
      owner: { ...this.#owner }
    };
  }
  // toJSON() { return this.toObject(); }

}

module.exports = PetEntity;
