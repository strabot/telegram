import dayjs from 'dayjs'
import pino from 'pino'

import { Scheduler } from './services/Scheduler.js'
import { StrabotManager } from './services/StrabotManager.js'
import { bootstrap } from './bootstrap/index.js'

const logger = pino()

bootstrap({
  Scheduler,
  StrabotManager,
  dayjs,
  logger
})
