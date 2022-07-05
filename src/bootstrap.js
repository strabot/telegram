import { StrabotManager } from './services/StrabotManager.js'

export async function bootstrap() {
    await StrabotManager.get('telegram-config')
}
