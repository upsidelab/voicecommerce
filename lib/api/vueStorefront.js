import axios from 'axios'

class VueStorefrontApi {
  constructor(config) {
    this.endpoint = config.endpoint
  }

  async signIn(username, password) {
    const body = {
      username: username,
      password: password
    }

    const loginTokens = await axios.post(`${this.endpoint}/api/user/login`, body)

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
