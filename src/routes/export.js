const router = require('express').Router();
const { exportUsers } = require('../controllers/user-extension');

// get all users
router.get('/', (req, res) => {
  // const options = validateInputs(req.query)
  const options = req.query
  let { users } = exportUsers(options)
  res.send(users);
});

module.exports = router;
