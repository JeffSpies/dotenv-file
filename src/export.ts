import { config } from './dotenv/config'
import { stringify } from 'envfile'

export function toEnv (options) {
  const data = config(options).parsed
  console.log(stringify(data))
}