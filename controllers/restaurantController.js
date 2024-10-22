const Restaurant = require('../models/Restaurant');

// Add restaurant controller logic
exports.addRestaurant = async (req, res) => {
  const { name, address } = req.body;

  // Check if name and address are provided
  if (!name || !address) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Create a new restaurant linked to the authenticated user (req.user is set in the middleware)
    const newRestaurant = new Restaurant({
      name,
      address,
      owner: req.user._id, // req.user comes from the protect middleware
    });

    // Save the restaurant to the database
    await newRestaurant.save();

    res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });
  } catch (error) {
    console.error('Error adding restaurant:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete restaurant controller logic
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id; // Get restaurant ID from URL params

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    // If restaurant not found
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the authenticated user owns the restaurant
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }

    // Delete the restaurant using findByIdAndDelete
    await Restaurant.findByIdAndDelete(restaurantId);

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// Update restaurant controller logic
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id; // Get restaurant ID from URL params
    const { name, address } = req.body; // Get new data from request body

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    // If restaurant not found
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the authenticated user owns the restaurant
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    // Update the restaurant fields if provided
    if (name) restaurant.name = name;
    if (address) restaurant.address = address;

    // Save the updated restaurant to the database
    const updatedRestaurant = await restaurant.save();

    res.status(200).json({
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Error updating restaurant:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
//pagination
exports.getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { name, address, cuisine } = req.query;
    // create a search filter object
    let searchFilters = {};
    if (name) {
      searchFilters.name = { $regex: name, $options: 'i' };
    }
    if (address) {
      searchFilters.addresss = { $regex: name, $options: 'i' };
    }
    if (cuisine) {
      searchFilters.cuisine = { $regex: name, $options: 'i' };
    }
    // fetch paginated restaurants 
    const restaurants = await Restaurant.find(searchFilters).skip(skip).limit(limit);

    const total = await Restaurant.countDocuments(searchFilters);

    res.status(200).json({
      message: 'Restaurants fetched succssfully',
      page,
      totalPages: Math.ceil(total / limit),
      totalRestaurants: total,
      restaurants,
    });
  } catch (error) {
    console.error('Error getting restaurants:', error.message);
    res.status(500).json({ message: 'server error' });
  }
};