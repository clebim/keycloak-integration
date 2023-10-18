import { IncomingMessage, ServerResponse } from 'http'
import url from 'node:url'
import { buildRestResponse } from '../../shared/build-rest-response'
import { appConfig } from '../../config/index'
import { Keycloak } from '../../services/keycloak'

export const keycloakRedirectCallback = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const keycloakService = new Keycloak()
  const objectUrl = url.parse(request.url as string, true)
  const queryParams = objectUrl.query
  const cookies = request.headers.cookie?.split('; ').reduce(
    (acc, currentValue) => {
      const [key, value] = currentValue.split('=')
      acc[key] = value
      return acc
    },
    {} as { [key: string]: string },
  )

  if (!queryParams.code) {
    return buildRestResponse(response, 422, { message: 'Invalid params' })
  }

  if (queryParams.state !== cookies?.csrfToken) {
    return buildRestResponse(response, 401, { message: 'Unauthorized' })
  }

  const accessToken = await keycloakService.user.getToken({
    code: queryParams.code as string,
    grantType: 'authorization_code',
    clientId: appConfig.KEYCLOAK.clientId,
    redirectUri: appConfig.KEYCLOAK.redirectUri,
  })

  const payload = accessToken.split('.')[1]
  const payloadDecoded = JSON.parse(
    Buffer.from(payload, 'base64').toString('utf-8'),
  )

  if (payloadDecoded.nonce !== cookies?.nonce) {
    return buildRestResponse(response, 401, { message: 'Unauthorized' })
  }

  return buildRestResponse(response, 200, { accessToken })
}
