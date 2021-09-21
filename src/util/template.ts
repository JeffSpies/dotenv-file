import _ from "lodash"

interface IData {
  [key: string]: string
}

// https://gist.github.com/tmarshall/31e640e1fa80c597cc5bf78566b1274c
export function template (template: string, data: IData = {}): string {
  if (!('_' in data)) {
    data['_'] = require('lodash')
  }
  const compiled = _.template(template)
  return compiled(data)
}
