const express = require('express');
const { protect } = require('../middleware/auth');
const { addReview, getReviews } = require('../controllers/reviewController');
const router = express.Router();

// Route to add a review (protected route)
router.post('/', protect, addReview);

// Route to get reviews for a specific restaurant
router.get('/:restaurantId', getReviews);

module.exports = router;
