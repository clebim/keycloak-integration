import { KeycloakRoleService } from './keycloak-role-service'
import { KeycloakUserService } from './keycloak-user-service'

export class Keycloak {
  public role: KeycloakRoleService
  public user: KeycloakUserService

  constructor() {
    this.role = new KeycloakRoleService()
    this.user = new KeycloakUserService()
  }
}
