import { generateNewEnv } from './generateNewEnv'
import { parseEnv } from './parseEnv'

(async () => {
  const {config, metadata, compiled} = await parseEnv('.env')
  console.log(generateNewEnv(config))
})()