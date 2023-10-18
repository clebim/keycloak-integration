import { app } from './app'
import { appConfig } from './config/index'
import { logger } from './logger/index'

const { port, host } = appConfig.SERVER

app.server.listen(3333, () =>
  logger.info(`Worker ${process.pid} running server ${host}:${port}`),
)
