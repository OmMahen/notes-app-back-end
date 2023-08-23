const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      // memverifikasi apakah payload request sudah sesuai
      this._validator.validatePostAuthenticationPayload(request.payload);

      // memeriksa apakah kredensial yang dikirimkan pada request sesuai.
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      // membuat access token dan refresh token.
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      // menyimpan dulu refreshToken ke database
      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      // memastikan payload request mengandung properti refreshToken yang bernilai string.
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      // verifikasi ketersediaan refreshToken di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // verifikasi signature refreshToken
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });

      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      // pastikan permintaan membawa payload yang berisi refreshToken.
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      // memastikan refreshToken tersebut ada di database.
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // menghapusnya dari database
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
