import { IncomingMessage, ServerResponse } from 'http'
import { randomBytes } from 'node:crypto'
import { appConfig } from '../../config/index'

export const loginKeycloakRedirect = async (
  _: IncomingMessage,
  response: ServerResponse,
) => {
  const nonce = randomBytes(16).toString('hex')
  const csrfToken = randomBytes(16).toString('hex')

  const loginParams = new URLSearchParams({
    client_id: appConfig.KEYCLOAK.clientId,
    redirect_uri: appConfig.KEYCLOAK.redirectUri,
    response_type: 'code',
    scope: 'openid',
    nonce,
    state: csrfToken,
  })
  const maxAge = 5

  response.setHeader('Set-Cookie', [
    `csrfToken=${csrfToken}; HttpOnly; Path=/; max-age=${maxAge}`,
    `nonce=${nonce}; HttpOnly; Path=/; max-age=${maxAge}`,
  ])

  const authUrl = appConfig.KEYCLOAK.getAuthRoute(loginParams.toString())
  response.writeHead(302, {
    Location: authUrl,
  })
  response.end()
}
