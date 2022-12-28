const router = require('express').Router();

// static resource routes
const echo = require('./echo');
const users = require('./users');

router.use('/users', users);
router.use('/echo', echo);

module.exports = router
