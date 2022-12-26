const firebase = require("firebase-scrypt")

const scryptFirebase = ({ plainPassword, salt, memcost, saltr, sep, signkey }) => {

  let value;

  return {

    calc: async () => {
      const scrypt = new firebase.FirebaseScrypt({
        memCost: memcost,
        rounds: saltr,
        saltSeparator: sep,
        signerKey: signkey
      })
      value = await scrypt.hash(plainPassword, salt)
    },

    result: () => value,

    calculatedParams: () => { salt },

    exportedHashPart: () => { throw Error("not implemented yet") }
  }

}

module.exports = { scryptFirebase } 