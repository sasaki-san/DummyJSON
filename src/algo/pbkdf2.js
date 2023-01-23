const crypto = require('crypto')

const pbkdf2 = ({ plainPassword, encoding, salt, saltEncoding, saltRounds, keylen, digest }) => {

  let value;

  let phcValue;

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
      hashValue = Buffer.from(hash).toString("base64")
      value = `$pbkdf2-${digest}$i=${saltRounds},l=${keylen}$${hashValue.substring(0, hashValue.length - 2)}`
    },

    result: () => value,

    calculatedParams: () => { salt, hashValue },

    exportedHashPart: () => ({
      custom_password_hash: {
        algorithm: "pbkdf2",
        hash: {
          value,
          encoding: encoding
        },
      }
    })


  }

}

module.exports = { pbkdf2 } 