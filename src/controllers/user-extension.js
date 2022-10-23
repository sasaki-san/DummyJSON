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
  ...mfaFactorsPart(options, user),
  ...passwordHashPart(options, user)
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
  passwordHash: user.password_bcrypt_utf8
})

const mfaFactorsPart = (options, user) => {

  const mfa_factors = []

  if (options.mfa_totp_secret) {
    mfa_factors.push({ totp: { secret: options.mfa_totp_secret } })
  }
  if (options.mfa_phone_number) {
    mfa_factors.push({ phone: { secret: options.mfa_phone_number } })
  }
  if (options.mfa_email) {
    mfa_factors.push({ email: { value: options.mfa_email } })
  }

  return {
    mfa_factors
  }
}

const passwordHashPart = (options, user) => {

  if (!options.password_params) {
    return {}
  }

  const [password_algorithm, password_encoding = "hex"] = options.password_params.split(",")

  if (password_algorithm === "bcrypt") {
    return {
      password_hash: user.password_bcrypt_utf8,
    }
  }

  // with salt
  if (options.salt_params) {
    const [salt_encoding, salt_position = "prefix"] = options.salt_params.split(",")
    return {
      custom_password_hash: {
        algorithm: password_algorithm,
        hash: {
          value: user[`password_${password_algorithm}_salt_${salt_position}_${password_encoding}`],
          encoding: password_encoding
        },
        salt: {
          value: user[`password_${password_algorithm}_salt_${salt_encoding}`],
          encoding: salt_encoding
        }
      }
    }
  }

  // without salt
  return {
    custom_password_hash: {
      algorithm: password_algorithm,
      hash: {
        value: user[`password_${password_algorithm}_${password_encoding}`],
        encoding: password_encoding
      },
    }
  }
}

const applyExportProps = (options, result) => {
  switch (options.format) {
    case "auth0_users": {
      result.users = result
        .users
        .map(auth0UsersFormatStrategy(options))
      return result
    }
    case "auth0_passwords": {
      result.users = result
        .users
        .map(auth0PasswordsFormatStrategy(options))
      return result
    }
    default: throw Error(`Undefined export format type: ${options.format}`)
  }
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

controller.exportUsers = (options) => {
  const result = controller.getAllUsers({ limit: options.limit, skip: options.skip })
  applyExportProps(options, result)
  applySelect(options, result)
  return result
}

module.exports = controller;
