export type CreateKeycloakUser = {
  attributes: { [key: string]: string }
  id: string
  email: string
  firstName: string
  emailVerified: boolean
  lastName: string
  username: string
  enabled: boolean
  credentials: {
    value: string
    type: 'password'
    temporary?: boolean
  }[]
}
