import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { resolveHome } from '../util/resolve-home'
import { parse, DotenvParseOutput } from './parse'

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
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}