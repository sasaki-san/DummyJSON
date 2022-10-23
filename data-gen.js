const fs = require("fs")
const crypto = require('crypto')
const bcrypt = require("bcrypt")
const users = require("./src/data/users.json")


const withSalt = (plainPassword, salt, prefixed) => {
  if (salt) {
    if (prefixed) {
      plainPassword = salt + plainPassword
    } else {
      plainPassword = plainPassword + salt
    }
  }
  return plainPassword
};

const setHashedPassword = (user, value, algorithm, encoding, salt, prefixed) => {
  if (salt) {
    if (prefixed) {
      user[`password_${algorithm}_salt_prefix_${encoding}`] = value;
    } else {
      user[`password_${algorithm}_salt_suffix_${encoding}`] = value;
    }
    const buf = Buffer.from(salt, 'utf8')
    user[`password_${algorithm}_salt_utf8`] = buf.toString('utf8');
    user[`password_${algorithm}_salt_hex`] = buf.toString('hex');
    user[`password_${algorithm}_salt_base64`] = buf.toString('base64');
  } else {
    user[`password_${algorithm}_${encoding}`] = value;
  }
  return true
};

const strategies = {

  md5: async (user, salt, prefixed) => {
    let plainPassword = withSalt(user.password, salt, prefixed);
    ["hex", "base64"].forEach(encoding => {
      const hash = crypto.createHash("md5");
      const _ = hash.update(plainPassword);
      const value = _.digest(encoding);
      setHashedPassword(user, value, "md5", encoding, salt, prefixed);
    });
    return user
  },

  sha1: async (user, salt, prefixed) => {
    let plainPassword = withSalt(user.password, salt, prefixed);
    ["hex", "base64"].forEach(encoding => {
      const hash = crypto.createHash("sha1");
      const _ = hash.update(plainPassword);
      const value = _.digest(encoding);
      setHashedPassword(user, value, "sha1", encoding, salt, prefixed);
    });
    return user
  },

  sha256: async (user, salt, prefixed) => {
    let plainPassword = withSalt(user.password, salt, prefixed);
    ["hex", "base64"].forEach(encoding => {
      const hash = crypto.createHash("sha256");
      const _ = hash.update(plainPassword, "utf8")
      const value = _.digest(encoding);
      setHashedPassword(user, value, "sha256", encoding, salt, prefixed);
    });
    return user
  },

  sha512: async (user, salt, prefixed) => {
    let plainPassword = withSalt(user.password, salt, prefixed);
    ["hex", "base64"].forEach(encoding => {
      const hash = crypto.createHash("sha512");
      const _ = hash.update(plainPassword, 'utf-8');
      const value = _.digest(encoding);
      setHashedPassword(user, value, "sha512", encoding, salt, prefixed);
    });
    return user
  },

  bcrypt: async (user) => {
    const plainPassword = user.password;
    const saltRound = 10;
    const salt = bcrypt.genSaltSync(saltRound);
    const value = bcrypt.hashSync(plainPassword, salt);
    const encoding = "utf8";
    user[`password_bcrypt_${encoding}`] = value;
    return user
  },

}

const getUserSalt = (user) => `This is the salt for ${user.firstName} ${user.lastName}`

const main = async () => {
  let result = await Promise.all(users.map(user => strategies["md5"](user)))
  result = await Promise.all(result.map(user => strategies["md5"](user, getUserSalt(user), true)))
  result = await Promise.all(result.map(user => strategies["md5"](user, getUserSalt(user), false)))
  result = await Promise.all(result.map(user => strategies["sha1"](user)))
  result = await Promise.all(result.map(user => strategies["sha1"](user, getUserSalt(user), true)))
  result = await Promise.all(result.map(user => strategies["sha1"](user, getUserSalt(user), false)))
  result = await Promise.all(result.map(user => strategies["sha256"](user)))
  result = await Promise.all(result.map(user => strategies["sha256"](user, getUserSalt(user), true)))
  result = await Promise.all(result.map(user => strategies["sha256"](user, getUserSalt(user), false)))
  result = await Promise.all(result.map(user => strategies["sha512"](user)))
  result = await Promise.all(result.map(user => strategies["sha512"](user, getUserSalt(user), true)))
  result = await Promise.all(result.map(user => strategies["sha512"](user, getUserSalt(user), false)))
  result = await Promise.all(result.map(user => strategies["bcrypt"](user)))
  let data = JSON.stringify(result, null, 2);
  fs.writeFileSync(`./src/data/users.json`, data);
}

main().then(() => console.log("done"))