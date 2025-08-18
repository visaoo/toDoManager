const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10; // valor default
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
}

async function comparePasswords(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

module.exports = {
  hashPassword,
  comparePasswords
};