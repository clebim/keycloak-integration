import { IncomingMessage, ServerResponse } from 'http'
import { buildRestResponse } from '../../../shared/build-rest-response'
import { KeycloakIntegrationError } from '../../../errors/keycloak-integration-error'
import { CreateRoleData } from '../../../services/interfaces'
import { Keycloak } from '../../../services/keycloak'

export const createClientRole = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const keycloakService = new Keycloak()
  try {
    const data = request.body as CreateRoleData
    await keycloakService.role.createClientRole(data)

    return buildRestResponse(response, 201, { message: 'success' })
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
