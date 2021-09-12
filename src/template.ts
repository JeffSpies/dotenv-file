interface IData {
  [key: string]: string
}

// https://gist.github.com/tmarshall/31e640e1fa80c597cc5bf78566b1274c
export function template (template: string, data: IData = {}): string {
  const handler = new Function('vars', `
    return (
      ( ${Object.keys(data).join(', ')} ) => \`${template}\`
    )(...Object.values(vars));
  `)
  return handler(data)
}
