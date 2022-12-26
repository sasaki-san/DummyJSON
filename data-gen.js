const fs = require("fs")
const users = require("./src/data/users copy.json")
const { strategies } = require('./src/utils/hashStrategies')

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

const getUserSalt = (user) => `SALT_${user.email}`

const propName = (paramsObj) => {
  const keySplitter = "|"
  const keyPairConnector = "_"
  return Object.keys(paramsObj).reduce((p, c) => {
    if (p.length > 0) { p += keySplitter }
    p += `${c}${keyPairConnector}${paramsObj[c]}`
    return p
  }, "")
}

const getPasswordHashPartList = (user) => {

  const salt = getUserSalt(user)

  const props = [].concat(
    cartesian(
      ["md5", "sha1", "sha256", "sha512"],
      ["hex", "base64"]
    ).map(p => {
      const [alg, enc] = p
      return { [propName({ alg, enc })]: strategies[alg](user, enc) }
    }),
    cartesian(
      ["md5", "sha1", "sha256", "sha512"],
      ["hex", "base64"],
      ["pre", "post"]
    ).map(p => {
      const [alg, enc, saltpos] = p
      return { [propName({ alg, enc, saltpos })]: strategies[alg](user, enc, salt, saltpos === "pre") }
    }),
    cartesian(
      ["bcrypt"],
      [10]
    ).map(p => {
      const [alg, saltr] = p
      return { [propName({ alg, saltr })]: strategies[alg](user, saltr) }
    }),
    cartesian(
      ["pbkdf2"],
      [1000, 10000],
      [32],
      ["sha1", "sha256"]
    ).map(p => {
      const [alg, saltr, l, d] = p
      return { [propName({ alg, saltr, l, d })]: strategies[alg](user, salt, saltr, l, d) }
    }),
    // cartesian(
    //   ["scryptfb"],
    //   [14],
    //   [8],
    //   ["Bw=="],
    //   ["ewjcFY/Vguy7cC9PE8C+2waKIrYkg2C40AL3oGs7WAvffBiZVr/RqM98t7wlViX5sgQXApxKYF3KL3LiuLjo5w=="]
    // ).map(p => {
    //   const [alg, memcost, saltr, sep, signkey] = p
    //   return { [propName({ alg, memcost, saltr })]: strategies[alg](user, salt, memcost, saltr, sep, signkey) }
    // }),
  )
  return props
}

const main = () => {
  const result = users.map(user =>
    getPasswordHashPartList(user)
      .reduce((p, c) => ({ ...p, ...c }), user)
  )
  const data = JSON.stringify(result, null, 2);
  fs.writeFileSync(`./src/data/users.json`, data);
}

const test = () => {
  console.log(strategies["pbkdf2"]({ password: "Test@123" }, "wJuJqLoUFsdXa8k3sFhRlA==", 10000, 20, "sha1"))
  console.log(strategies["pbkdf2"]({ password: "Test@123" }, "wJuJqLoUFsdXa8k3sFhRlA==", 10000, 32, "sha256"))
}

main()
// test()
