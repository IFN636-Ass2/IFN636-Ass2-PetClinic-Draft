const { AdminUser, StaffUser } = require('../domain/UserEntity');

class UserFactory {
  static create(role, request = {}) {
    switch (role) {
      case "admin": 
        return new AdminUser({...request})
      case "staff":
        return new StaffUser({...request})
      default:
        throw new Error("Invalid role.")
    }
  }
}

module.exports = { UserFactory };
