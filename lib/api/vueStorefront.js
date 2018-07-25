import axios from "axios"
import { InvalidCredentialsError, ConnectionError } from "./errors"

class VueStorefrontApi {
  constructor(config) {
    this.endpoint = config.endpoint
  }

  async signIn(username, password) {
    const loginTokens = await this._fetchTokens(username, password)

    const userToken = loginTokens.data.result
    const userRefreshToken = loginTokens.data.meta.refreshToken

    const userId = await this._fetchUserId(userToken)

    const result = {
      id: userId,
      apiToken: userToken,
      apiRefreshToken: userRefreshToken
    }

    return result
  }

  async _fetchTokens(username, password) {
    const body = { username: username, password: password }

    try {
      const loginTokens = await axios.post(`${this.endpoint}/api/user/login`, body)
      return loginTokens
    } catch (e) {
      if (e.response && e.response.status == 500) {
        throw new InvalidCredentialsError("Invalid login or password")
      }
      throw new ConnectionError("There was an error connecting to the store")
    }
  }

  async _fetchUserId(userToken) {
    try {
      const userDetails = await axios.get(`${this.endpoint}/api/user/me?token=${userToken}`)
      return userDetails.data.result.id
    } catch (e) {
      throw new ConnectionError("There was an error connecting to the store")
    }
  }
}

export { VueStorefrontApi }
