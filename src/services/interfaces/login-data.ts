export type LoginData = {
  username?: string
  password?: string
  code?: string
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  grantType: 'authorization_code' | 'password' | 'client_credentials'
}
