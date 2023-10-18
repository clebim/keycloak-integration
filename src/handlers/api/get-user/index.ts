import { IncomingMessage, ServerResponse } from 'http'
import { KeycloakIntegrationError } from '../../../errors/keycloak-integration-error'
import { buildRestResponse } from '../../../shared/build-rest-response'
import { Keycloak } from '../../../services/keycloak'

export const getUser = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const keycloakService = new Keycloak()
  try {
    const userId = request.params.id
    const user = await keycloakService.user.getUser(userId)

    if (!user) {
      buildRestResponse(response, 404, { message: 'not found' })
    }

    return buildRestResponse(response, 200, user)
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
