const { commonAlgorithm } = require("./common")

const sha1 = ({ plainPassword, encoding, salt, prefixed }) => {

  const common = commonAlgorithm({ algo: "sha1", plainPassword, encoding, salt, prefixed })

  return {
    calc: () => common.calc(),
    result: () => common.result(),
    calculatedParams: () => common.calculatedParams(),
    exportedHashPart: () => common.exportedHashPart()
  }

}

module.exports = { sha1 }