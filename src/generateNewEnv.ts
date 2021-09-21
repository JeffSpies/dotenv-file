import { parse, stringify } from 'envfile'
import _ from 'lodash'
import { versions, IVersion } from './metadata'
import version from './version'
import { template } from './util/template'

interface IInput {
  version: string
}

function expandVariables (parsed) {
  let changed = true
  const changedFields = []
  while (changed) {
    changed = false
    for (const [key, value] of Object.entries(parsed)) {
      const originalValue = value
      parsed[key] = template(<string>value, { ...parsed })
      if (parsed[key] !== originalValue) {
        changedFields.push(key)
        changed = true
      }
    }
  }
  return _.pick(parsed, changedFields)
}

function replaceDelimiter(content, pattern, replacement) {
  return content.replace(pattern, replacement)
}

function generateBanner (version: IVersion, input: IInput) {
  const headerFn: Function = <Function>version.header
  return headerFn(input)
}

function generateMetadataBlock(metadataVersion: IVersion, input: IInput) {
  const metadata = []

  metadata.push(generateBanner(metadataVersion, input))

  const envArray = stringify(
    _.reduce(metadataVersion.metadata, (agg, value, key) => {
      agg[key] = value(input)
      return agg
    }, {})
  ).split(/[\n\r]/)

  // length - 1 because envArray ends with a blank line
  for (let i = 0; i < envArray.length - 1; i++) {
    metadata.push(
      replaceDelimiter(
        `${metadataVersion.prefix}${envArray[i]}`,
        '=',
        ': '
      )
    )
  }
  return metadata.join('\n')
}

export function generateNewEnv(config) {
  const currentVersion = versions[version]
  const input: IInput = { version }
  const metadata = generateMetadataBlock(currentVersion, input)
  const parsedConfig = parse(config)
  const expanded = stringify(expandVariables(parsedConfig))
  return`${config}\n\n${metadata}\n${expanded}`
}