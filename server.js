const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb = require('./config/db');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

const app = express();
connectDb();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send('<h1>Welcome to food server</h1>');
});

// Use auth routes
app.use('/api/auth', authRoutes);  // Mount the auth routes at /api/auth
app.use('/api/restaurants', restaurantRoutes);

app.use('/api/reviews', reviewRoutes);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


