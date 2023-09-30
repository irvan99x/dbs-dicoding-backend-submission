const EncryptionHelper = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends EncryptionHelper {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('Incorrect Credentials');
    }
  }
}

module.exports = BcryptPasswordHash;
