import readline from 'readline'
import fs from 'fs'

export function readLines (path: string, onReadLine) {
  return new Promise ((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path),
      output: (process.stdout),
      terminal: false
    })
    readInterface.on('line', onReadLine)
    readInterface.on('close', resolve)
  })
}