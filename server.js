const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb = require('./config/db');


dotenv.config()


const app = express();
connectDb();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

app.get('/', (req, res) => {
  return res.status(200).send('<h1>Welcome to food server<h1>');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});