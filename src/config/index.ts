export const appConfig = {
  SERVER: {
    port: 3333,
    host: 'http://localhost',
  },
  KEYCLOAK: {
    host: 'http://localhost:8080',
    credentials: {
      clientId: 'd467a072-99a4-4832-a7e3-3f88529e71ff',
      clientSecret: 'g0OTf6PTYwBN81V3OyVffuIM5Y0q7v68',
    },
    getAuthRoute: function (params: string) {
      return `${this.host}/realms/${this.realm}/protocol/openid-connect/auth?${params}`
    },
    getTokenRoute: function () {
      return `${this.host}/realms/${this.realm}/protocol/openid-connect/token`
    },
    createUserRoute: function () {
      return `${this.host}/admin/realms/${this.realm}/users`
    },
    getUser: function (id: string) {
      return `${this.host}/admin/realms/${this.realm}/users/${id}`
    },
    createClientRole: function () {
      return `${this.host}/admin/realms/${this.realm}/clients/${this.clientRealmId}/roles`
    },
    realm: 'code-dev',
    clientId: 'b88a4b9d-5da6-4905-b42b-aa0b542600cc',
    clientRealmId: 'c95d633c-a2dd-41ce-9ba4-dd86cebf3133',
    redirectUri: 'http://localhost:3333/api/sso/callback',
  },
}
