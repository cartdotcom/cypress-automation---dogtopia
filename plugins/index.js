/// <reference types="cypress" />

const cypress = require('cypress')
const fs = require('fs-extra')
const path = require('path')


function getConfig(file) {
  const pathConfigFile = path.resolve(`${file}`)
  return fs.readJSON(pathConfigFile)
}

module.exports = (on, config) => {
  const file = config.env.configFile || 'cypress.dev.json'
  return getConfig(file)
}
