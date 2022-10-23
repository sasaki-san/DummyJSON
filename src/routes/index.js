const router = require('express').Router();

// static page routes
const staticRoutes = require('./static');

// static resource routes
const authRoutes = require('./auth');
const cartRoutes = require('./cart');
const commentRoutes = require('./comment');
const postRoutes = require('./post');
const productRoutes = require('./product');
const quoteRoutes = require('./quote');
const todoRoutes = require('./todo');
const userRoutes = require('./user');
const userByEmailRoutes = require('./user-by-email');
const userExportRoutes = require('./export');
const httpStatusRoutes = require('./http');

// dynamic resource routes
const countRoute = require('./count');

router.use('/', staticRoutes);
router.use('/auth', authRoutes);
router.use('/auth0-bulk-import', userExportRoutes);
router.use('/carts', cartRoutes);
router.use('/comments', commentRoutes);
router.use('/posts', postRoutes);
router.use('/products', productRoutes);
router.use('/quotes', quoteRoutes);
router.use('/todos', todoRoutes);
router.use('/users', userRoutes);
router.use('/users-by-email', userByEmailRoutes);
router.use('/export', userExportRoutes);
router.use('/count', countRoute);
router.use('/http', httpStatusRoutes);

module.exports = router;
