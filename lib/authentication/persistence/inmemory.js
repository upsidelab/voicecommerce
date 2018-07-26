class InMemoryAuthenticationPersistence {
  constructor() {
    this.authorizationCodes = {}
    this.accessTokens = {}
    this.refreshTokens = {}
  }

  async saveAuthorizationCode({authorizationCode, expiresAt, redirectUri, userId, userApiToken, userApiRefreshToken, clientId}) {
    this.authorizationCodes[authorizationCode] = {
      code: authorizationCode,
      expiresAt: expiresAt,
      redirectUri: redirectUri,
      client: { id: clientId },
      user: { id: userId, apiToken: userApiToken, apiRefreshToken: userApiRefreshToken }
    }
  }

  async getAuthorizationCode(authorizationCode) {
    return this.authorizationCodes[authorizationCode]
  }

  async deleteAuthorizationCode(authorizationCode) {
    const codePresent = authorizationCode in this.authorizationCodes
    delete this.authorizationCodes[authorizationCode]
    return codePresent
  }

  async saveToken({accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, userId, userApiToken, userApiRefreshToken, clientId}) {
    const client = { id: clientId }
    const user = { id: userId, apiToken: userApiToken, apiRefreshToken: userApiRefreshToken }

    this.accessTokens[accessToken] = {
      accessToken: accessToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      client: client,
      user: user
    }

    this.refreshTokens[refreshToken] = {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      client: client,
      user: user
    }
  }

  async getAccessToken(accessToken) {
    return this.accessTokens[accessToken]
  }

  async getRefreshToken(refreshToken) {
    return this.refreshTokens[refreshToken]
  }

  async deleteRefreshToken(refreshToken) {
    const tokenPresent = refreshToken in this.refreshTokens
    delete this.refreshTokens[refreshToken]
    return tokenPresent
  }
}

const inMemoryAuthenticationPersistence = new InMemoryAuthenticationPersistence()

export { inMemoryAuthenticationPersistence }
