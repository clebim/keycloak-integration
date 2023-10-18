import { randomUUID } from 'crypto'
import { IncomingMessage, ServerResponse } from 'http'
import { KeycloakIntegrationError } from '../../../errors/keycloak-integration-error'
import { Keycloak } from '../../../services/keycloak'
import { buildRestResponse } from '../../../shared/build-rest-response'

export const createUser = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  const keycloakService = new Keycloak()
  try {
    const data = request.body
    const splittedName = data.name.split(' ')
    const userId = randomUUID()

    await keycloakService.user.createUser({
      email: data.email,
      id: userId,
      firstName: splittedName[0],
      emailVerified: true,
      lastName: splittedName.slice(1).join(' '),
      username: data.username,
      enabled: true,
      credentials: [
        {
          value: data.password,
          type: 'password',
        },
      ],
      attributes: {
        type: 'user',
      },
    })

    return buildRestResponse(response, 201, { id: userId })
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
