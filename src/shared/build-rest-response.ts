import { ServerResponse } from 'http'

export const buildRestResponse = (
  response: ServerResponse,
  statusCode: number,
  data: Record<string, any>,
): ServerResponse => {
  response.setHeader('Content-Type', 'application/json')
  response.writeHead(statusCode)
  response.end(JSON.stringify(data, null, 2))
  return response
}
