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
  } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /login
exports.loginUser = async (req, res) => {
  try {
    const { token, user } = await UserService.login(req.body);
    return res.json({ token, user });
  } catch (error) {
        res.status(500).json({ message: error.message });
    
  }
};

// GET /profile   
exports.getProfile = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserService.getProfile(req.user.id);
    return res.json(user);
  } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /profile  
exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const updated = await UserService.updateProfile(req.user.id, req.body);
    return res.json(updated);
  } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
