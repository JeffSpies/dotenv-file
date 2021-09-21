import compareVersions from 'compare-versions'

type Comparison = -1 | 0 | 1

export function getClosestVersion (list: string[], version: string): string {
  const sortedList: string[] = list.sort(compareVersions).reverse()
  for (let j = 0; j < list.length; j++) {
    const comparison: Comparison = compareVersions(version, sortedList[j])
    if (comparison === -1) {
    } else if (comparison === 1 && j !== 0) {
      return sortedList[j-1]
    } else if ( comparison === 0) {
      return sortedList[j]
    } else {
      throw Error('Bad version found')
    }
  }
}