class InvalidCredentialsError extends Error {
  constructor(...args) {
    super(...args)
    this.invalidCredentials = true
    Error.captureStackTrace(this, InvalidCredentialsError)
  }
}

export { InvalidCredentialsError }
