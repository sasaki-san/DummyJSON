const { commonAlgorithm } = require("./common")

const md5 = ({ plainPassword, encoding, salt, prefixed }) => {

  const common = commonAlgorithm({ algo: "md5", plainPassword, encoding, salt, prefixed })

  return {
    calc: () => common.calc(),
    result: () => common.result(),
    calculatedParams: () => common.calculatedParams(),
    exportedHashPart: () => common.exportedHashPart()
  }

}

module.exports = { md5 }