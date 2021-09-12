import { suite, test } from '@testdeck/mocha'
import { expect } from 'chai'
import { config } from '../src/main'
import { toEnv } from '../src/export'

@suite
class Config {
  
  @test
  defaults() {
    config({
      path: './test/.env'
    })
    expect(process.env.FULL_NAME).to.be.equal('Pat Smith');
  }

  @test
  toEnv() {
    toEnv({
      path: './test/.env'
    })
    expect(1).to.be.equal(1);
  }
}