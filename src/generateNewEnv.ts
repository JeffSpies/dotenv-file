import { stringify } from 'envfile'
import _ from 'lodash'

import { versions, IVersion } from './metadata'
import version from './version'

interface IInput {
  version: string
}

export function generateMetadata(metadataVersion: IVersion, input: IInput) {
  let metadata = []
  const headerFn: Function = <Function>metadataVersion.header
  metadata.push(headerFn(input))
  const envArray = stringify(
    _.reduce(metadataVersion.metadata, (agg, value, key) => {
      agg[key] = value(input)
      return agg
    }, {})
  ).split(/[\n\r]/)
  for (let i = 0; i < envArray.length - 1; i++) {
    metadata.push(`${metadataVersion.prefix}${envArray[i]}`.replace('=', ': '))
  }
  return metadata.join('\n')
}

export function generateNewEnv(config) {
  const currentVersion = versions[version]
  const metadata = generateMetadata(currentVersion, { version })
  const file = `${config}\n\n${metadata}\n`
  return file
}