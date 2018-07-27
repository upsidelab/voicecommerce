import { handler } from "./oauth/handler"

class Authentication {
  constructor(persistence) {
    this.persistence = persistence
  }

  oauthHandler(api, config) {
    return handler(this.persistence, api, config)
  }

  async getUser(accessToken) {
    const storedToken = await this.persistence.getAccessToken(accessToken)
    if (!storedToken) {
      return null
    }

    return storedToken.user
  }
}

export { Authentication }
