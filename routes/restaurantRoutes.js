const express = require('express');
const { protect } = require('../middleware/auth');
const { addRestaurant, deleteRestaurant, updateRestaurant, getRestaurants } = require('../controllers/restaurantController');
const router = express.Router();

// Protected route to add a restaurant
router.post('/add', protect, addRestaurant);
router.delete('/:id', protect, deleteRestaurant);
router.put('/:id', protect, updateRestaurant);
router.get('/', getRestaurants);
module.exports = router;

