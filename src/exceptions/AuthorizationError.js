const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403); // unauthorized
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
