const router = require('express').Router();
const { getUserByEmail, } = require('../controllers/user');

// get user by email 
router.get('/:email', (req, res) => {
  const { email } = req.params;
  const { select } = req._options;

  res.send(getUserByEmail({ email, select }));
});

module.exports = router;
