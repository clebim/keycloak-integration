export class KeycloakIntegrationError extends Error {
  public statusCode: number
  public responseData: Record<string, any>

  constructor(statusCode: number, responseData: Record<string, any>) {
    super('Keycloak integration error')
    super.name = KeycloakIntegrationError.name
    this.statusCode = statusCode
    this.responseData = responseData
  }
}
