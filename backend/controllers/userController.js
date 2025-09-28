const jwt = require('jsonwebtoken');
const { UserService } = require('../services/userService');

// 
function signToken(userId, role = 'staff') {
  if (!process.env.JWT_SECRET) {
    throw new Error('Server misconfigured: JWT_SECRET missing');
  }
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// POST /register
exports.registerUser = async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    const token = signToken(user.id, user.role || 'staff');
    return res.status(201).json({ token, user });
  } catch (err) {
    const msg = String(err?.message || '');
    const code =
      /already exists|already registered|duplicate/i.test(msg) ? 409 :
        /required|invalid/i.test(msg) ? 400 : 500;
    return res.status(code).json({ message: msg || 'Failed to register' });
  }
};

// POST /login
exports.loginUser = async (req, res) => {
  try {
    const { token, user } = await UserService.login(req.body);
    return res.json({ token, user });
  } catch (err) {
    const msg = String(err?.message || '');
    const code =
      /invalid email or password/i.test(msg) ? 401 :
        /required/i.test(msg) ? 400 : 500;
    return res.status(code).json({ message: msg || 'Failed to login' });
  }
};

// GET /profile   
exports.getProfile = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserService.getProfile(req.user.id);
    return res.json(user);
  } catch (err) {
    const msg = String(err?.message || '');
    const code = /not found/i.test(msg) ? 404 : 500;
    return res.status(code).json({ message: msg || 'Failed to get profile' });
  }
};

// PUT /profile  
exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const updated = await UserService.updateProfile(req.user.id, req.body);
    return res.json(updated);
  } catch (err) {
    const msg = String(err?.message || '');
    const code =
      /already registered|already exists|duplicate/i.test(msg) ? 409 :
        /invalid/i.test(msg) ? 400 :
          /not found/i.test(msg) ? 404 : 500;
    return res.status(code).json({ message: msg || 'Failed to update profile' });
  }
};
