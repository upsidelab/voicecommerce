import { handler } from "./oauth/handler"

class Authentication {
  constructor(persistence) {
    this.persistence = persistence
  }

  oauthHandler(api, config) {
    return handler(this.persistence, api, config)
  }

  getUser(accessToken) {
    return this.persistence.getAccessToken(accessToken).user
  }
}

export { Authentication }
