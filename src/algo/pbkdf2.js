const crypto = require('crypto')

const pbkdf2 = ({ plainPassword, encoding, salt, saltEncoding, saltRounds, keylen, digest }) => {

  let value;

  if (!plainPassword) {
    throw Error(`You must pass plainPassword parameter`)
  }

  salt = Buffer.from(salt, saltEncoding)

  return {

    calc: () => {
      const hash = crypto.pbkdf2Sync(
        plainPassword,
        salt,
        parseInt(saltRounds),
        parseInt(keylen),
        digest
      )
      value = Buffer.from(hash).toString("base64")
    },

    result: () => value,

    calculatedParams: () => { salt },

    exportedHashPart: () => ({
      custom_password_hash: {
        algorithm: "pbkdf2",
        hash: {
          value,
          encoding: encoding
        },
        salt: {
          value: salt.toString(saltEncoding),
          encoding: saltEncoding
        }
      }
    })


  }

}

module.exports = { pbkdf2 } 