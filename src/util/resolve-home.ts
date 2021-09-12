import path from 'path'
import os from 'os'

export function resolveHome (envPath: string) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}