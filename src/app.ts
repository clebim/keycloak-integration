import { createUser, getToken, getUser } from './handlers/api'
import { createClientRole } from './handlers/api/create-client-role'
import { health } from './handlers/health'
import { keycloakRedirectCallback, loginKeycloakRedirect } from './handlers/sso'
import { HttpServer } from './http-server'

export const app = new HttpServer()

app.setUrlPrefix('/api')

app.get('/health/status', health)
app.get('/users/:id', getUser)

app.post('/users', createUser)
app.post('/token', getToken)
app.post('/roles/client', createClientRole)

app.get('/sso', loginKeycloakRedirect)
app.get('/sso/callback', keycloakRedirectCallback)
