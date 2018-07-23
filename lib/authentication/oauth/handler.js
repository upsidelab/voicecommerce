import express from "express"
import OAuthServer from "express-oauth-server"
import bodyParser from "body-parser"
import OAuthModel from "./model"
import path from "path"
import pug from "pug"

function handler(persistence, api, config) {
  const router = express.Router()
  const oauthModel = new OAuthModel(persistence, api, config)
  const oauth = new OAuthServer({ model: oauthModel, useErrorHandler: true })

  const renderLoginPage = (locals) => {
    const loginConfig = config.login || {}
    const defaultTemplateFile = path.join(__dirname, "..", "templates", "authorize.pug")

    const templateFile = loginConfig.template || defaultTemplateFile
    return pug.renderFile(templateFile, locals || {})
  }

  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: false }))

  router.get("/authorize", (_request, response) => {
    const renderedTemplate = renderLoginPage()
    response.send(renderedTemplate)
  })

  const authenticateHandler = {
    handle: function (request) {
      const username = request.body.username
      const password = request.body.password
      return api.signIn(username, password)
    }
  }

  router.use("/authorize", oauth.authorize({ authenticateHandler: authenticateHandler }))
  router.post("/token", oauth.token())

  router.use("/authorize", (error, _request, response, next) => {
    if (error.invalidCredentials) {
      const renderedTemplate = renderLoginPage({ message: "Invalid email or password" })
      response.send(renderedTemplate)
    } else {
      next(error)
    }
  })

  return router
}

export { handler }
