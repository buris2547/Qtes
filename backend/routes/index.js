const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categories');
const productsRoutes = require('./products');
const stockRoutes = require('./stock');
const dashboardRoutes = require('./dashboard');

router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/stock', stockRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
