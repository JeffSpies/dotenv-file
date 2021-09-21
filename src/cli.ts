import { Command } from 'commander'
import version from './version'
import { generateNewEnv } from './generateNewEnv'
import { parseEnv } from './parseEnv'

async function processAction (envfile): Promise<void> {
  const {config, metadata, compiled} = await parseEnv(envfile)
  console.log(generateNewEnv(config))
}

async function addAction (variable, value, options) {
  console.log(options.type)
}

export function run (): void {
  const program = new Command()
  program
    .version(version)
    .description('Making envfiles more powerful')
  
  program
    .command('process')
    .description('Process envfile')
    .argument('[envfile]', 'The envfile you want to process', './.env')
    .argument('[schema]', 'The schema file you want to validate against', './.env.schema')
    .action(processAction)

  program
    .command('generate-schema')
    .description('Generate a schema from an environment file')
    .argument('[envfile]', '', './.env')

  program
    .command('generate-envfile')
    .description('Generate an environtment from a schema file')
    .argument('[schema]', '', './.env')
  
  program
    .command('add')
    .description('Add variable to your template')
    .argument('<variable>')
    .argument('<value>')
    .option('-t, --type <type>', 'The variable\'s type', 'string')
    .option('-r, --required [required]', 'The variable is required', true)
  
    program.parse()
}

(async () => {
  await run()
})()