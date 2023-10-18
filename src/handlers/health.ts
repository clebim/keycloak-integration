import { IncomingMessage, ServerResponse } from 'http'

export const health = (request: IncomingMessage, response: ServerResponse) => {
  response.setHeader('Content-Type', 'application/json')
  response.writeHead(200)
  response.end(
    JSON.stringify(
      {
        status: 'ok',
        dateTime: new Date().toISOString(),
      },
      null,
      2,
    ),
  )
}
