import { IncomingMessage, ServerResponse } from 'http'
import { appConfig } from '../../../config'
import { KeycloakIntegrationError } from '../../../errors/keycloak-integration-error'
import { Keycloak } from '../../../services/keycloak'
import { buildRestResponse } from '../../../shared/build-rest-response'
import { LoginProps } from './interfaces'

export const getToken = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const keycloakService = new Keycloak()
  try {
    const data = request.body as LoginProps

    if (!data.grantType) {
      data.grantType = 'password'
    }

    if (!data.clientId) {
      data.clientId = appConfig.KEYCLOAK.clientId
    }

    const token = await keycloakService.user.getToken(data)
    return buildRestResponse(response, 200, { access_token: token })
  } catch (error) {
    if (error instanceof KeycloakIntegrationError) {
      return buildRestResponse(response, error.statusCode, {
        message: error.message,
        ...error.responseData,
      })
    }

    throw error
  }
}
