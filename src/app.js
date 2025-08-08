const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const productsRouter = require('./routes/products');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productsRouter);

const uri = process.env.MONGODB_URI;
if (uri) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));
} else {
  logger.info('No MONGODB_URI provided — using in-memory store');
}

module.exports = app;
