import { template } from './template'

import dotenv from 'dotenv'
import os from 'os'
import fs from 'fs'
import path from 'path'

function log (message: string) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

function resolveHome (envPath: string) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

type DotenvParseOptions = {
  debug?: boolean
  expand?: boolean
  defaults?: any
}

type DotenvParseOutput = {
  [key: string]: string
}

export function parse (src: string | Buffer, options?: DotenvParseOptions ): DotenvParseOutput {
  const parsedSrc = dotenv.parse(src, options)

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

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: BufferEncoding, // encoding of .env file
  debug?: boolean // turn on logging for debugging purposes
  expand?: boolean
  defaultsPath?: string
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

export function config (options?: DotenvConfigOptions): DotenvConfigOutput {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding: BufferEncoding = 'utf8'
  let debug = false
  let expand = true
  let defaultsPath

  if (options && options.path != null) {
    dotenvPath = resolveHome(options.path)
  }
  if (options && options.encoding != null) {
    encoding = options.encoding
  }
  if (options && options.debug != null) {
    debug = true
  }
  if (options && options.expand !== undefined) {
    expand = options.expand
  }
  if (options && options.defaultsPath !== undefined) {
    defaultsPath = resolveHome(options.defaultsPath)
  } else {
    defaultsPath = `${dotenvPath}.defaults`
  }

  let defaults = fs.existsSync(defaultsPath)
    ? dotenv.parse(fs.readFileSync(defaultsPath, { encoding }))
    : {}
  
  const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), {
    debug,
    expand,
    defaults
  })

  try {
    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

export default {
  config,
  parse
}