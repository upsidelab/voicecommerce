# Setting custom login screen

To customize tthe login screen, set the `login.template` property in the config passed to `oauthHandler`.
VoiceCommerce uses [pug](https://pugjs.org/api/getting-started.html) for templating.

```javascript
const oauthConfig = {
  login: {
    template: 'custom_login.pug'
  }
  clients: [...]
}
```

The login form should send a `POST` request to the the same URL, with `username` and `password` fields.

```pug
form(method="POST")
  input(type="text" name="username")
  input(type="password" name="password")
  input(type="submit" value="Submit")
```
