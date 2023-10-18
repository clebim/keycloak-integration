import { appConfig } from '../config'
import { KeycloakIntegrationError } from '../errors/keycloak-integration-error'
import { HttpMethods } from '../http-server'
import { logger } from '../logger'

export class KeycloakBase {
  public async getKeycloakToken() {
    try {
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: appConfig.KEYCLOAK.credentials.clientId,
        client_secret: appConfig.KEYCLOAK.credentials.clientSecret,
      })

      const response = await fetch(appConfig.KEYCLOAK.getTokenRoute(), {
        method: HttpMethods.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })
      const responseData = response.body ? await response.json() : {}

      if (response.status !== 200) {
        throw new KeycloakIntegrationError(response.status, responseData)
      }
      const accessToken = responseData.access_token
      return `Bearer ${accessToken}`
    } catch (error: any) {
      logger.error(error.message)
      throw error
    }
  }
}
