const controller = require("./user")

const auth0UsersFormatStrategy = (options) => (user) => ({
  email: user.email,
  email_verified: false,
  user_id: user.id,
  username: user.username,
  given_name: user.firstName,
  family_name: user.lastName,
  name: `${user.firstName} ${user.lastName}`,
  nickname: user.firstName,
  picture: user.image,
  blocked: false,
  app_metadata: {
    ip: user.ip,
    ein: user.ein
  },
  user_metadata: {
    birthDate: user.birthDate,
    bloodGroup: user.bloodGroup,
    height: user.height,
    weight: user.weight,
    hair: user.hair,
    address: user.address
  },
})

const auth0PasswordsFormatStrategy = (options) => (user) => ({
  email: user.email,
  _id: {
    "$oid": user.id
  },
  email_verified: false,
  password_set_date: {
    "$date": new Date().toISOString()
  },
  tenant: options.tenant,
  connection: options.connection,
  _tmp_is_unique: true,
})

const auth0TotpFormatStrategy = (options) => (user) => ({
  user_id: `${options.idPrefix}|${user.id}`,
  otp_secret: options.mfa_totp_secret,
  tenant: options.tenant,
})

const auth0RecoveryCodeFormatStrategy = (options) => (user) => ({
  user_id: `${options.id_prefix}|${user.id}`,
  recovery_code: options.mfa_rc,
  tenant: options.tenant,
})

const applyExportProps = (strategy, options, result) => {
  result.users = result
    .users
    .map(strategy(options))
  return result
}

const applySelect = (options, result) => {
  if (!options.select) {
    return result

  }
  const s = (options.select || "").split(",")
  if (s.length === 0) {
    return result
  }

  result.users = result.users.map(user => {
    return s.reduce((p, c) => {
      return {
        ...p,
        [c]: user[c]
      }
    }, {})
  })

}

const validateOptions = (options, ...requiredParams) => {
  for (let requiredParam of requiredParams) {
    if (options[requiredParam] === undefined) {
      throw Error(`The required parameter ${requiredParam} is missing in the query`)
    }
  }
}

controller.exportUsers = (options) => {
  const result = controller.getAllUsers({ limit: options.limit, skip: options.skip })
  applyExportProps(auth0UsersFormatStrategy, options, result)
  applySelect(options, result)
  return result
}

controller.exportUserPasswords = (options) => {
  validateOptions(options, "tenant", "connection")
  const result = controller.getAllUsers({ limit: options.limit, skip: options.skip })
  applyExportProps(auth0PasswordsFormatStrategy, options, result)
  applySelect(options, result)
  return result
}

controller.exportUserMfaTotp = (options) => {
  validateOptions(options, "totpSecret", "tenant", "idPrefix")
  const result = controller.getAllUsers({ limit: options.limit, skip: options.skip })
  applyExportProps(auth0TotpFormatStrategy, options, result)
  applySelect(options, result)
  return result
}

module.exports = controller;
