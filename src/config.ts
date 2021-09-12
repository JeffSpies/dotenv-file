import envOptions from 'dotenv/lib/env-options'
import cliOptions from 'dotenv/lib/cli-options'
import { config } from './main'

(function () {
  config(
    Object.assign(
      {},
      envOptions,
      cliOptions(process.argv)
    )
  )
})()