const bcrypt = require('bcrypt');
const { toPlain } = require('../utils/toPlain');

// Parent class UserEntity
class UserEntity {
  // encapsulation
  #id; #name; #phone; #email; #password; #role; #position; #address;

  constructor({ _id, name, phone, email, password, position = null, address = null, role = 'staff' }) {
    console.log("debug", name)

    if (!name || !email || !password) {
      throw new Error('User: name, email, password are required');
    }

    this.#id = _id;
    this.#name = String(name).trim();
    this.#phone = String(phone).trim() || null;
    this.#email = String(email).toLowerCase();
    this.#password = password;
    this.#position = position ? String(position).trim() : null;
    this.#address = address ? String(address).trim() : null;
    this.#role = role;
  }

  // getters
  get id() { return this.#id; }
  get name() { return this.#name; }
  get phone() { return this.#phone; }
  get email() { return this.#email; }
  get position() { return this.#position; }
  get address() { return this.#address; }
  get role() { return this.#role; }

  // safe setters
  setName(name) {
    if (!name) {
      this.#name = this.#name
      return;
    }
    this.#name = name;
  }
  setPhone(phone) {
    if (!phone) {
      this.#phone = this.#phone
      return;
    }
    const p = String(phone || '').trim();
    this.#phone = p;
  }
  setEmail(email) {
    if (!email) {
      this.#email = this.#email
      return;
    }
    const e = String(email || '').toLowerCase().trim();
    this.#email = e;
  }
  setPassword(password) {
    if (!password) {
      this.#password = this.#password
      return;
    }
    const pw = String(password || '');
    this.#password = pw;
  }

  setRole(role) {
    if (['admin', 'staff'].includes(String(role).trim())) {
      this.#role = role
    }
  }

  setPosition(position) {
    this.#position = position ? String(position).trim() : null;
  }

  setAddress(address) {
    this.#address = address ? String(address).trim() : null;
  }
  comparePassword(plain) {
    return bcrypt.compare(String(plain || ''), this.#password);
  }

  // Polymorphism
  getPermissions() {
    return ['appointment:view', 'pet:view', 'treatment:view'];
  }

  // mapping
  fromRequest() {
    return {
      name: this.#name,
      phone: this.#phone,
      email: this.#email,
      password: this.#password,
      position: this.#position,
      address: this.#address,
      role: this.#role,
    };
  }
  fromDB() {
    return {
      _id: this.#id,
      name: this.#name,
      phone: this.#phone,
      email: this.#email,
      position: this.#position,
      address: this.#address,
      role: this.#role,
    };
  }

}

// Inheritance
// Subclass Admin for UserEntity
class AdminUser extends UserEntity {
  constructor(args = {}) {
    super({ ...toPlain(args), role: 'admin' });
  }
  getPermissions() {
    return [
      'appointment:view', 'appointment:update', 'appointment:create', 'appointment:delete',
      'pet:view', 'pet:update', 'pet:create', 'pet:delete',
      'treatment:view', 'treatment:create', 'treatment:delete',
      'user:view', 'user:update', 'user:create', 'user:delete'
    ];
  }
  setRole(role) {
    if (['admin', 'staff'].includes(String(role).trim())) {
      super.setRole(role);
    }
  }

  setPosition(position) {
    super.setPosition(position);
  }

}

// Subclass Staff for UserEntity
class StaffUser extends UserEntity {
  constructor(args = {}) {
    super({ ...toPlain(args), role: 'staff' });
  }
  getPermissions() {
    return [
      'appointment:view', 'appointment:update', 'appointment:create', 'appointment:delete',
      'pet:view', 'pet:update', 'pet:create',
      'treatment:view', 'treatment:create',
      'user:view', 'user:update', 'user:create'
    ];
  }
  setRole(role) {
    throw new Error('Not have permission to set role'); 
    }

  setPosition(position) {
    throw new Error('Not have permission to set position'); 
  }
  
  }

module.exports = {
  UserEntity,
  AdminUser,
  StaffUser
};
