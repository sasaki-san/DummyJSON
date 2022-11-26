const crypto = require('crypto')

const commonAlgorithm = ({ algo, plainPassword, encoding, salt, saltEncoding, prefixed }) => {

  let value

  if (!plainPassword) {
    throw Error(`You must pass plainPassword parameter`)
  }

  let saltedPassword = plainPassword

  encoding = encoding || "utf-8"

  if (salt) {
    saltedPassword = prefixed ? `${salt}${plainPassword}` : `${plainPassword}${salt}`
  }

  saltEncoding = saltedPassword || "utf-8"

  prefixed = !!prefixed || true

  return {

    calc: () => {
      const hash = crypto.createHash(algo);
      const _ = hash.update(saltedPassword);
      value = _.digest(encoding);
    },

    result: () => value,

    calculatedParams: () => ({
      encoding,
      salt,
      saltedPassword,
      saltEncoding,
      prefixed
    }),

    exportedHashPart: () => ({
      custom_password_hash: {
        algorithm: algo,
        hash: {
          value,
          encoding: encoding
        },
        ...(salt ? {
          salt: {
            value: salt,
            encoding: saltEncoding
          }
        } : {})
      }
    })

  }
}

module.exports = { commonAlgorithm }
