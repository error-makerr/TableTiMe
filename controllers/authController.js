const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration logic
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Login logic
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for empty email or password
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If no user is found
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },  // Payload
      process.env.JWT_SECRET,  // Secret
      { expiresIn: '1h' }  // Token expiry
    );

    // Return success with token and user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
