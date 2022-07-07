import pino from 'pino'

import { StrabotManager } from './services/StrabotManager.js'
import { bootstrap } from './bootstrap/index.js'

const logger = pino()

bootstrap({
  StrabotManager,
  logger
})
