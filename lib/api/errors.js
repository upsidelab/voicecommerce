class InvalidCredentialsError extends Error {
  constructor(...args) {
    super(...args)
    this.invalidCredentials = true
    Error.captureStackTrace(this, InvalidCredentialsError)
  }
}

class ConnectionError extends Error {
  constructor(...args) {
    super(...args)
    this.connection = true
    Error.captureStackTrace(this, ConnectionError)
  }
}

export { InvalidCredentialsError, ConnectionError }
