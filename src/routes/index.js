const router = require('express').Router();

// static resource routes
const echo = require('./echo');
const echoBulk = require('./echo-bulk');

router.use('/echo-bulk', echoBulk);
router.use('/echo', echo);

module.exports = router;
