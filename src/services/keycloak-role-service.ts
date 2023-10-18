import { appConfig } from '../config'
import { KeycloakIntegrationError } from '../errors/keycloak-integration-error'
import { HttpMethods } from '../http-server'
import { CreateRoleData } from './interfaces'
import { KeycloakBase } from './keycloak-base'

export class KeycloakRoleService extends KeycloakBase {
  public async createClientRole(data: CreateRoleData): Promise<void> {
    const token = await this.getKeycloakToken()
    console.log(data)
    const response = await fetch(appConfig.KEYCLOAK.createClientRole(), {
      method: HttpMethods.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    })
    const responseData = Buffer.isBuffer(response.body)
      ? await response.json()
      : {}

    if (response.status >= 400) {
      throw new KeycloakIntegrationError(response.status, responseData)
    }
  }

  public async createRealmRole(): Promise<void> {
    throw new Error('method not implemented')
  }
}
