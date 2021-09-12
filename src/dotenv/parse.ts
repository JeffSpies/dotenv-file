import dotenv from 'dotenv'
import { template } from '../util/template'

export type DotenvParseOptions = {
  debug?: boolean
  expand?: boolean
  defaults?: any
}

export type DotenvParseOutput = {
  [key: string]: string
}

export function parse (src: string | Buffer, options?: DotenvParseOptions ): DotenvParseOutput {
  const parsedSrc = dotenv.parse(src, options) // todo only debug

  const defaults = options.defaults || {}

  const parsed = {
    ...defaults,
    ...parsedSrc
  }

  if (options.expand) {
    let changed = true
    while (changed) {
      changed = false
      for (const [key, value] of Object.entries(parsed)) {
        const originalValue = value
        try {
          parsed[key] = template(<string>value, parsed)
          // todo check for inappropriate recursion
          if (!changed && parsed[key] !== originalValue) {
            changed = true
          }
        } catch (error) {
        }
      }
    }
  }

  return parsed
}