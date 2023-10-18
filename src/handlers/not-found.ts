import { IncomingMessage, ServerResponse } from 'http'

export const notFound = (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  response.setHeader('Content-Type', 'application/json')
  response.writeHead(404)
  response.end(JSON.stringify({ message: 'Route not found' }))
}
