const { commonAlgorithm } = require("./common")

const sha512 = ({ plainPassword, encoding, salt, prefixed }) => {

  const common = commonAlgorithm({ algo: "sha512", plainPassword, encoding, salt, prefixed })

  return {
    calc: () => common.calc(),
    result: () => common.result(),
    calculatedParams: () => common.calculatedParams(),
    exportedHashPart: () => common.exportedHashPart()
  }

}

module.exports = { sha512 }