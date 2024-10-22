const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Log the token for verification
    //console.log('Token:', token);  // This logs the token for debugging

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();  // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Token verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = {
  protect,
};
