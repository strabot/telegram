import pino from 'pino'

import { Scheduler } from './services/Scheduler'
import { StrabotManager } from './services/StrabotManager'
import { bootstrap } from './bootstrap'

const logger = pino()

bootstrap({
  Scheduler,
  StrabotManager,
  logger,
})
