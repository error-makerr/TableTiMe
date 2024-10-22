// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // To link with the user who owns the restaurant
    ref: 'User',
  },
  avarageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
