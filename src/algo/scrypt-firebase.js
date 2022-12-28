const firebase = require("firebase-scrypt")

const scryptFirebase = ({ plainPassword, salt, saltRounds, memCost, saltSeparator, signerKey }) => {

  let value;

  if (!plainPassword) {
    throw Error(`You must pass plainPassword parameter`)
  }

  return {

    calc: async () => {
      const scrypt = new firebase.FirebaseScrypt({
        memCost: parseInt(memCost),
        rounds: parseInt(saltRounds),
        saltSeparator: saltSeparator,
        signerKey: signerKey
      })
      value = await scrypt.hash(plainPassword, salt)
      // const isValid = await scrypt.verify(plainPassword, salt, passwordHash);
      // console.log(isValid)
    },

    result: () => value,

    calculatedParams: () => { },

    exportedHashPart: () => { throw Error("not implemented yet") }
  }

}

module.exports = { scryptFirebase } 