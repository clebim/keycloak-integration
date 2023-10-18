export type LoginProps = {
  username?: string
  password?: string
  grantType: 'authorization_code' | 'password' | 'client_credentials'
  clientId?: string
  clientSecret?: string
}
