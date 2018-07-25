import assert from "assert"
import OAuthModel from "../../../lib/authentication/oauth/model"

describe("model", () => {
  const config = {
    clients: [
      {
        clientId: "CLIENT1",
        clientSecret: "SECRET1",
        redirectUris: ["http://example.org"]
      },
      {
        clientId: "CLIENT2",
        clientSecret: "SECRET2",
        redirectUris: ["http://example2.org"]
      }
    ]
  }
  const model = new OAuthModel(null, null, config)

  describe("#getClient", () => {
    it("throws an error when client is not present in config", () => {
      assert.rejects(model.getClient("INCORRECT_CLIENT"))
    })

    it("throws an error when client and secret is not present in config", () => {
      assert.rejects(model.getClient("INCORRECT_CLIENT", "INCORRECT_SECRET"))
    })

    it("throws an error when client secret is incorrect", () => {
      assert.rejects(model.getClient("CLIENT1", "INCORRECT_SECRET"))
    })

    it("returns client when client id is correct and secret null", (done) => {
      model.getClient("CLIENT1", null).then((client) => {
        assert.equal(client.id, "CLIENT1")
        assert.deepEqual(client.grants, ["authorization_code", "refresh_token"])
        assert.deepEqual(client.redirectUris, ["http://example.org"])
        done()
      }).catch((err) => { done(err) })
    })

    it("returns client when client id and client secret are correct", (done) => {
      model.getClient("CLIENT1", "SECRET1").then((client) => {
        assert.equal(client.id, "CLIENT1")
        assert.deepEqual(client.grants, ["authorization_code", "refresh_token"])
        assert.deepEqual(client.redirectUris, ["http://example.org"])
        done()
      }).catch((err) => { done(err) })
    })
  })

  describe("#grantTypeAllowed", () => {
    it("returns true when grant is authorization_code", (done) => {
      model.grantTypeAllowed("CLIENT1", "authorization_code").then((result) => {
        assert.equal(result, true)
        done()
      }).catch((err) => { done(err) })
    })

    it("returns true when grant is refresh_token", (done) => {
      model.grantTypeAllowed("CLIENT1", "refresh_token").then((result) => {
        assert.equal(result, true)
        done()
      }).catch((err) => { done(err) })
    })

    it("throws an error when client id is invalid", () => {
      assert.rejects(model.grantTypeAllowed("INCORRECT_CLIENT", "refresh_token"))
    })

    it("throws an error when grant type is invalid", () => {
      assert.rejects(model.grantTypeAllowed("CLIENT1", "invalid_grant"))
    })
  })
})
