const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const { UserFactory } = require('../patterns/UserFactory');


const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// 
class UserService {
  // Register
  async register(user = {}) {
    const { phone, position, address, role } = user
    const name = String(user.name || '').trim();
    const email = String(user.email || '').toLowerCase().trim();
    const password = String(user.password || '');

    // check required fields are provided
    if (!name || !email || !password) throw new Error('name, email, password are required');

    // check if user email is existed
    const exists = await UserModel.findOne({ email }).lean();
    if (exists) throw new Error('User already exists');
    // create entity for user
    const userEntity = UserFactory.create(['admin', 'staff'].includes(role) ? role : 'staff', {
      name,
      email,
      phone,
      password,
      position,
      address
    });
    // create new user in DB
    return await UserModel.create(userEntity.fromRequest());
  }

  // login
  async login({ email, password } = {}) {
    email = String(email).toLowerCase().trim();
    password = String(password);

    // check required fields are provided
    if (!email || !password) throw new Error('email, password are required');

    // get user information by email from DB
    const user = await UserModel.findOne({ email });

    // check if email is correct
    if (!user) throw new Error('Invalid email or password');

    // check if password is correct
    const userEntity = UserFactory.create(user.role, user);
    const isValid = userEntity.comparePassword(password)
    if (!isValid) throw new Error('Invalid email or password');

    // return token & user information from DB
    return { token: generateToken(userEntity.id), user: userEntity.fromDB() };
  }

  // View profile
  async getProfile(id) {
    // get user by id from DB 
    const user = await UserModel.findById(id);
    if (!user) throw new Error('User not found');

    // return user from DB
    return UserFactory.create(user.role, user).fromDB();
  }

  // Update profile
  async updateProfile(id, patch = {}) {
   
    // get user from DB by user id
    const user = await UserModel.findById(id);
    if (!user) throw new Error('User not found');

    // create entity and update data
    const updateUser = UserFactory.create(user.role, {...user})

    updateUser.setEmail(patch.email);
    updateUser.setName(patch.name)
    updateUser.setPhone(patch.phone)
    updateUser.setAddress(patch.address)
    updateUser.setPassword(patch.password)
    updateUser.setRole(patch.role)
    updateUser.setPosition(patch.position)

    return await UserModel.findOneAndUpdate({_id: id}, {...updateUser.fromRequest()});
  }
}

module.exports = { UserService: new UserService() };