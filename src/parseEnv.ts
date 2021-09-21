import _ from 'lodash'
import { versions as metadataVersions, IVersion } from './metadata'
import { getClosestVersion } from './util/get-closest-version'
import { readLines } from './util/read-lines'

export async function parseEnv(path: string) {

  let isBannerFound = false
  let isBannerJustFound = false
  let isMetadataFound = false

  let existingConfig = ''
  let existingCompiled = ''
  let existingMetadata = ''
  let metadataPrefixRe = null
  let metadataElements = null

  const headerRes = _.map(metadataVersions, (version: IVersion) => {
    const header: Function = <Function>version.header
    return new RegExp(`^${header({ version: '(?<version>[0-9]+\.[0-9]+\.[0-9]+)'})}$`)
  })

  function onLine (line) {
    if (!isBannerFound) {
      for (let i = 0; i < headerRes.length; i++) {
        const reResult = headerRes[i].exec(line)
        if (reResult) {
          const foundVersion = reResult.groups.version
          const relevantVersion = getClosestVersion(
            Object.keys(metadataVersions),
            foundVersion
          )
          const relevantMetadataVersion = metadataVersions[relevantVersion]
          isBannerFound = true
          metadataPrefixRe = new RegExp(`^${relevantMetadataVersion.prefix}(.*)$`)
          metadataElements = relevantMetadataVersion.metadata
          isBannerJustFound = true
          return
        }
      }
      if (!isBannerJustFound) {
        existingConfig += `${line}\n`
      }
      return
    }
    if (isBannerJustFound || isMetadataFound) {
      isBannerJustFound = false
      const metadataReResult = metadataPrefixRe.exec(line)
      if (metadataReResult) {
        isMetadataFound = true
        existingMetadata += `${metadataReResult[1]}\n`
        return
      }

      isMetadataFound = false
    }
    existingCompiled += `${line}\n`
  }

  await readLines(path, onLine)

  return {
    config: _.trim(existingConfig),
    metadata: _.trim(existingMetadata),
    compiled: _.trim(existingCompiled)
  }
}
