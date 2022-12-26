const router = require('express').Router();

// static resource routes
const user = require('./user');
const users = require('./users');

router.use('/users', users);
router.use('/user', user);
router.use('/', (req, res) => {
  res.send(`
<html>
<body>

<a href='https://documenter.getpostman.com/view/21861725/VUxNRnau#5d7760e0-15dc-46da-9c3d-0a1eb39b57db'>API Documentation</a>

</body>
</html>  
  `)
})

module.exports = router;
