import express from "express"
import OAuthServer from "express-oauth-server"
import bodyParser from "body-parser"
import OAuthModel from "./model"
import path from "path"
import pug from "pug"

const renderLoginPage = (config, locals) => {
  const loginConfig = config.login || {}
  const defaultTemplateFile = path.join(__dirname, "..", "templates", "authorize.pug")

  const templateFile = loginConfig.template || defaultTemplateFile
  return pug.renderFile(templateFile, locals || {})
}

const authenticateHandler = (api) => {
  return {
    handle: function (request) {
      const username = request.body.username
      const password = request.body.password
      return api.signIn(username, password)
    }
  }
}

function handler(persistence, api, config) {
  const router = express.Router()
  const oauthModel = new OAuthModel(persistence, api, config)
  const oauth = new OAuthServer({ model: oauthModel, useErrorHandler: true })

  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: false }))

  router.get("/authorize", (_request, response) => {
    const renderedTemplate = renderLoginPage(config)
    response.send(renderedTemplate)
  })

  router.use("/authorize", oauth.authorize({ authenticateHandler: authenticateHandler(api) }))
  router.post("/token", oauth.token())

  router.use("/authorize", (error, _request, response, next) => {
    if (error.invalidCredentials || error.connection) {
      const renderedTemplate = renderLoginPage(config, { message: error.message })
      response.send(renderedTemplate)
    } else {
      next(error)
    }
  })

  return router
}

export { handler }
