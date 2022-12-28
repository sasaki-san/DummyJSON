const { md5 } = require("./md5")
const { sha1 } = require("./sha1")
const { sha256 } = require("./sha256")
const { sha512 } = require("./sha512")
const { bcrypt } = require("./bcrypt")
const { pbkdf2 } = require("./pbkdf2")
const { scryptFirebase } = require("./scrypt-firebase")

module.exports = {
  md5,
  sha1,
  sha256,
  sha512,
  bcrypt,
  pbkdf2,
  scryptFirebase
}