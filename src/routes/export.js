const router = require('express').Router();
const { exportUsers, exportUserPasswords, exportUserMfaTotp } = require('../controllers/user-extension');

router.get('/', (req, res) => {
  const options = req.query
  let { users } = exportUsers(options)
  res.send(users);
});

router.get('/passwords', (req, res) => {
  const options = req.query
  let { users } = exportUserPasswords(options)
  res.send(users);
});

router.get('/mfa_totp', (req, res) => {
  const options = req.query
  let { users } = exportUserMfaTotp(options)
  res.send(users);
});

module.exports = router;
