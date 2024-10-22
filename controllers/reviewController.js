const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose')

// Add a review for a restaurant
exports.addReview = async (req, res) => {
  const { restaurantId, rating, comment } = req.body;

  try {
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create a new review
    const newReview = new Review({
      restaurant: restaurantId,
      user: req.user._id, // The user is logged in, so we get the ID from req.user
      rating,
      comment
    });

    // Save the review
    await newReview.save();

    // Update the restaurant's average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    restaurant.averageRating = avgRating.toFixed(2);  // Update the restaurant's average rating
    await restaurant.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch reviews for a specific restaurant
exports.getReviews = async (req, res) => {
  const { restaurantId } = req.params;

  // Check if the restaurantId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Fetch reviews for the restaurant
    const reviews = await Review.find({ restaurant: restaurantId }).populate('user', 'username');

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
