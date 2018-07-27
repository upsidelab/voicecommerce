class NoPastOrdersError extends Error {
  constructor(...args) {
    super(...args)
    this.noPastOrders = true
    Error.captureStackTrace(this, NoPastOrdersError)
  }
}

export { NoPastOrdersError }
