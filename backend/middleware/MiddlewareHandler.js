const jwt = require('jsonwebtoken');
const User = require('../models/User');

class MiddlewareHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler; // allows chaining: a.setNext(b).setNext(c)
  }

  async handle(req, res, next) {
    if (this.nextHandler) {
      return this.nextHandler.handle(req, res, next); // pass THREE args
    }
    return next();
  }
}

// authentication
class Protect extends MiddlewareHandler {
  async handle(req, res, next) {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

      // no token found, response error
      if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user by id
      const user = await User.findById(decoded.id).lean();
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user = { id: String(user._id), role: user.role || 'staff' };
      
      // continue next chain
      return super.handle(req, res, next);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}

// admin checking
class AdminOnly extends MiddlewareHandler {
  async handle(req, res, next) {

    // check role admin
    if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }

    // continue next chain
    return super.handle(req, res, next);
  }
}

module.exports = { MiddlewareHandler, Protect, AdminOnly };
