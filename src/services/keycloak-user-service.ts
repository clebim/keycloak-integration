import { appConfig } from '../config'
import { KeycloakIntegrationError } from '../errors/keycloak-integration-error'
import { HttpMethods } from '../http-server/types/http-methods-enum'
import { logger } from '../logger'
import { CreateKeycloakUser, LoginData } from './interfaces'
import { KeycloakBase } from './keycloak-base'

export class KeycloakUserService extends KeycloakBase {
  public async getToken(data: LoginData): Promise<string> {
    try {
      let body = {}

      if (data.grantType === 'authorization_code') {
        body = {
          client_id: data.clientId,
          redirect_uri: data.redirectUri,
          grant_type: 'authorization_code',
          code: data.code,
        }
      }

      if (data.grantType === 'password') {
        body = {
          client_id: data.clientId,
          grant_type: data.grantType,
          username: data.username,
          password: data.password,
        }
      }

      if (data.grantType === 'client_credentials') {
        body = {
          client_id: data.clientId,
          grant_type: data.grantType,
          client_secret: data.clientSecret,
        }
      }

      const formBody = new URLSearchParams(body).toString()

      const response = await fetch(appConfig.KEYCLOAK.getTokenRoute(), {
        method: HttpMethods.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      })
      const responseData: { access_token: string } = Buffer.isBuffer(
        response.body,
      )
        ? await response.json()
        : {}

      if (response.status !== 200) {
        throw new KeycloakIntegrationError(response.status, responseData)
      }
      return responseData.access_token
    } catch (error: any) {
      logger.error(error.message)
      throw error
    }
  }

  public async createUser(data: CreateKeycloakUser): Promise<void> {
    try {
      const token = await this.getKeycloakToken()
      const response = await fetch(appConfig.KEYCLOAK.createUserRoute(), {
        method: HttpMethods.POST,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      })

      if (response.status >= 400) {
        const responseData = response.body ? await response.json() : {}
        throw new KeycloakIntegrationError(response.status, responseData)
      }
    } catch (error: any) {
      logger.error(error.message)
      throw error
    }
  }

  public async getUser(id: string) {
    try {
      const token = await this.getKeycloakToken()
      const response = await fetch(appConfig.KEYCLOAK.getUser(id), {
        method: HttpMethods.GET,
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      })

      const responseData = Buffer.isBuffer(response.body)
        ? await response.json()
        : {}

      if (response.status >= 400) {
        throw new KeycloakIntegrationError(response.status, responseData)
      }
      return responseData.length ? responseData[0] : null
    } catch (error: any) {
      logger.error(error.message)
      throw error
    }
  }
}
