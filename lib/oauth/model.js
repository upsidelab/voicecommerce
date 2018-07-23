class OAuthModel {
  constructor(persistence, api, config) {
    this.persistence = persistence
    this.api = api
    this.config = config
  }

  async saveAuthorizationCode(code, client, user) {
    await this.persistence.saveAuthorizationCode(
      code.authorizationCode,
      code.expiresAt,
      code.redirectUri,
      user.id,
      user.apiToken,
      user.apiRefreshToken,
      client.id
    )

    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      client: { id: client.id },
      user: user
    }
  }

  async getAuthorizationCode(authorizationCode) {
    const result = await this.persistence.getAuthorizationCode(authorizationCode)
    return result
  }

  async revokeAuthorizationCode(authorizationCode) {
    const deleted = await this.persistence.deleteAuthorizationCode(authorizationCode.code)
    return deleted
  }

  async saveToken(token, client, user) {
    await this.persistence.saveToken(
      token.accessToken,
      token.accessTokenExpiresAt,
      token.refreshToken,
      token.refreshTokenExpiresAt,
      user.id,
      user.apiToken,
      user.apiRefreshToken,
      client.id
    )

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: { id: client.id },
      user: user
    }
  }

  async getAccessToken(accessToken) {
    const token = await this.persistence.getAccessToken(accessToken)

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client: { id: token.client.id },
      user: token.user
    }
  }

  async getRefreshToken(refreshToken) {
    const token = await this.persistence.getRefreshToken(refreshToken)

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: { id: token.client.id },
      user: token.user
    }
  }

  async revokeToken(token) {
    const deleted = await this.persistence.deleteRefreshToken(token.refreshToken)
    return deleted
  }

  async getClient(clientId, clientSecret) {
    const client = {
      id: this.config.clientId,
      grants: ["authorization_code"],
      redirectUris: this.config.redirectUris
    }

    if (clientId == this.config.clientId) {
      if (clientSecret == null || clientSecret == this.config.clientSecret) {
        return client
      }
    }

    throw "Unauthorized client"
  }

  async grantTypeAllowed(clientId, grantType) {
    if (clientId == this.config.clientId && this.config.grants.includes(grantType)) {
      return true
    } else {
      throw "Unauthorized grant"
    }
  }
}

export default OAuthModel
