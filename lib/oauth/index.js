import express from "express"
import OAuthServer from "express-oauth-server"
import bodyParser from "body-parser"
import OAuthModel from "./model"
import path from 'path'

function oauthServer(oauthModel) {
  return new OAuthServer({ model: oauthModel })
}

function oauthProvider(persistence, api, config) {
  const router = express.Router()
  const oauthModel = new OAuthModel(persistence, api, config)
  const oauth = new OAuthServer({ model: oauthModel, useErrorHandler: true })

  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: false }))

  const loginConfig = config.login || {}
  router.get("/authorize", (_req, res) => {
    res.sendFile(loginConfig.template || path.join(__dirname, 'templates', 'authorize.html'))
  })

  const authenticateHandler = {
    handle: function (request, response) {
      const username = request.body.username
      const password = request.body.password
      return api.signIn(username, password)
    }
  }

  router.use("/authorize", oauth.authorize({ authenticateHandler: authenticateHandler }))
  router.post("/token", oauth.token())

  return router
}

export { oauthServer, oauthProvider }
