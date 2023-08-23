const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  // payload: identitas pengguna (pada kasus ini: 'id')
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      // artifacts: token yang sudah di-decoded
      const artifacts = Jwt.token.decode(refreshToken);

      // verifySignature: mengecek kesesuaian signature milik refresh token
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
