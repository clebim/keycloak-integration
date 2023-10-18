export const logger = {
  info: (message: string) =>
    console.log(`\x1b[34m ${JSON.stringify(message, null, 2)} \x1b[37m`),
  error: (message: string) =>
    console.log(`\x1b[31m ${JSON.stringify(message, null, 2)} \x1b[37m`),
}
