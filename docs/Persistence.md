# Implementing persistence

The built-in `InMemoryAuthenticationPersistence` was made for demo purposes only
and you shouldn't rely on it.

Depending on the database you're using, you'll need to implement an adapter
for storing OAuth data.

The adapter interface requires all of the methods specified below.
All of them are required to return promises or be defined as `async`.

`saveAuthorizationCode({authorizationCode, expiresAt, redirectUri, userId, userApiToken, userApiRefreshToken, clientId})` - stores authorizationCode and related data for later use
`getAuthorizationCode(authorizationCode)` - retrieves previously stored authorization code and all associated data. Returns object of the following structure:
```javascript
{
  code: authorizationCode,
  expiresAt: expiresAt,
  redirectUri: redirectUri,
  client: { id: clientId },
  user: { id: userId, apiToken: userApiToken, apiRefreshToken: userApiRefreshToken }
}
```

`deleteAuthorizationCode` - deletes authorizationCode and all related data, returns `true` if code was found in the database.

`saveToken({accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, userId, userApiToken, userApiRefreshToken, clientId})` - stores accessToken and related data for later use

`getAccessToken(accessToken)` - retrieves previously stored access token and all associated data. Returns object of the following structure:
```javascript
{
  accessToken: accessToken,
  accessTokenExpiresAt: accessTokenExpiresAt,
  client: { id: clientId },
  user: { id: userId, apiToken: userApiToken, apiRefreshToken: userApiRefreshToken }
}
```

`getRefreshToken(refreshToken)` - retrieves previously stored refresh token and all associated data. Returns object of the following structure:
```javascript
{
  refreshToken: refreshToken,
  refreshTokenExpiresAt: refreshTokenExpiresAt,
  client: { id: clientId },
  user: { id: userId, apiToken: userApiToken, apiRefreshToken: userApiRefreshToken }
}
```

`deleteRefreshToken(refreshToken)` - deletes refreshToken and all associated data. Returns true if refresh token was found in the database.
