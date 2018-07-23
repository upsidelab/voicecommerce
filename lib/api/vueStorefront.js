import axios from "axios"
import { InvalidCredentialsError } from "./errors"

class VueStorefrontApi {
  constructor(config) {
    this.endpoint = config.endpoint
  }

  async signIn(username, password) {
    const body = { username: username, password: password }

    let loginTokens = {}
    try {
      loginTokens = await axios.post(`${this.endpoint}/api/user/login`, body)
    } catch (e) {
      throw new InvalidCredentialsError("Invalid login or password")
    }

    const userToken = loginTokens.data.result
    const userRefreshToken = loginTokens.data.meta.refreshToken

    const userDetails = await axios.get(`${this.endpoint}/api/user/me?token=${userToken}`)

    const result = {
      id: userDetails.data.result.id,
      apiToken: userToken,
      apiRefreshToken: userRefreshToken
    }

    return result
  }
}

export { VueStorefrontApi }
