const _bcrypt = require("bcrypt")

const bcrypt = ({ plainPassword, saltRounds }) => {

  let salt, value = undefined

  if (!plainPassword) {
    throw Error(`You must pass plainPassword parameter`)
  }

  saltRounds = saltRounds || "10" // auth0 default salt rounds

  return {

    calc: () => {
      salt = _bcrypt.genSaltSync(parseInt(saltRounds));
      value = _bcrypt.hashSync(plainPassword, salt);
    },

    result: () => value,

    calculatedParams: () => ({
      salt,
      saltRounds
    }),

    exportedHashPart: () => ({
      password_hash: value
    })

  }

}

module.exports = { bcrypt } 