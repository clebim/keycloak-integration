/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http, { IncomingMessage, ServerResponse } from 'http'
import { notFound } from '../handlers/not-found'
import { logger } from '../logger'
import { HttpMethods } from './types/http-methods-enum'

type RoutesMap = Map<HttpMethods, Map<string, Handler>>
type Handler = (request: IncomingMessage, response: ServerResponse) => any

export class HttpServer {
  public server!: http.Server
  private baseUrl = ''
  private routes: RoutesMap = new Map()

  constructor() {
    this.startServer()
  }

  private startServer() {
    this.server = http.createServer(this.listener.bind(this))
  }

  private prepareRequestToHandler(
    request: IncomingMessage,
    response: ServerResponse,
    handler: Handler,
  ) {
    let body = ''
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })

    request.on('end', async () => {
      request.body = body.length ? JSON.parse(body) : null

      try {
        return await handler.apply(this, [request, response])
      } catch (error: any) {
        logger.error(error?.message)
        response.writeHead(500)
        return response.end('Internal server error')
      }
    })
  }

  private getHandler(request: IncomingMessage, _: ServerResponse) {
    const method = (request?.method?.toUpperCase() ?? 'GET') as HttpMethods
    const url = request.url?.split('?')[0] as string
    const routes = this.routes.get(method)

    if (!routes) {
      return null
    }

    const apiRoutes = Array.from(routes.keys())

    if (routes.has(url)) {
      return routes.get(url)
    }

    const route = apiRoutes.find((apiRoute) => {
      const regex = new RegExp(apiRoute.replace(/:[^/]+/g, '[^/]+') + '$')
      return regex.test(url)
    })

    if (route) {
      const handler = routes.get(route) as Handler

      const apiRouteSplited = route.split('/')
      const urlSplited = url.split('/')

      const params = apiRouteSplited.reduce((acc, currentValue, index) => {
        if (currentValue.startsWith(':')) {
          acc[currentValue.slice(1)] = urlSplited[index]
        }
        return acc
      }, {} as any)
      request.params = params
      return handler
    }

    return null
  }

  private setHandler(method: HttpMethods, route: string, handler: Handler) {
    if (this.routes.has(method)) {
      const routes = this.routes.get(method)
      routes?.set(this.baseUrl.concat(route), handler)
      this.routes.set(method, routes!)
      return
    }

    this.routes.set(method, new Map([[this.baseUrl.concat(route), handler]]))
  }

  private listener(request: IncomingMessage, response: ServerResponse) {
    const handler = this.getHandler(request, response)

    if (!handler) {
      return notFound(request, response)
    }
    this.prepareRequestToHandler(request, response, handler)
  }

  public setUrlPrefix(prefix: string) {
    this.baseUrl = prefix
  }

  public post(route: string, handler: Handler) {
    this.setHandler(HttpMethods.POST, route, handler)
  }

  public get(route: string, handler: Handler) {
    this.setHandler(HttpMethods.GET, route, handler)
  }
}
