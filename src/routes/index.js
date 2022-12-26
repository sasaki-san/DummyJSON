const router = require('express').Router();

// static resource routes
const user = require('./user');
const users = require('./users');

router.use('/users', users);
router.use('/user', user);

module.exports = router;
