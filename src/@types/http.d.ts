declare module 'http' {
  interface IncomingMessage {
    params: { [key: string]: string }
    body: Record<string, any>
  }
}
