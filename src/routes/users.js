const router = require('express').Router();
const { exportUsers, exportUserPasswords, exportUserMfaTotp } = require('../controllers/user-extension');
const algorithms = require("../algo")

const convertToExportableFormat = (users, { format }) => {
  switch (format) {
    case "JSON_ARRAY":
      return "[" + users.map(user => JSON.stringify(user)).join(",\n") + "]"
    case "JSON_LINE":
      return users.map(user => JSON.stringify(user)).join("\n")
    default:
      return users
  }
}

/**
 * get bulk passwords (bcrypt)
 */
router.get('/password_hash', (req, res) => {
  const algorithm = algorithms["bcrypt"]({
    ...req.query
  })
  algorithm.calc()
  const exportHashPart = algorithm.exportedHashPart()
  let users = exportUserPasswords(req.query)
    .users
    .map(user => ({
      ...user,
      passwordHash: exportHashPart.password_hash
    }))
  users = convertToExportableFormat(users, req.query)
  res.send(users)
});

/**
 * get bulk mfa totp secrets
 */
router.get('/mfa/totp', (req, res) => {
  const { totpSecret, idPrefix } = req.query
  let users = exportUserMfaTotp(req.query)
    .users
    .map(user => ({
      ...user,
      totp: { secret: totpSecret }
    }))
  users = convertToExportableFormat(users, req.query)
  res.send(users)
});

/**
 * get bulk users with passwords 
 */
router.get('/:algo', (req, res) => {
  const { algo } = req.params;
  const algorithm = algorithms[algo]({
    ...req.query
  })
  algorithm.calc()
  const exportHashPart = algorithm.exportedHashPart()
  let users = exportUsers(req.query)
    .users
    .map(user => ({
      ...user,
      ...exportHashPart
    }))
  users = convertToExportableFormat(users, req.query)
  res.send(users)
});



module.exports = router;
