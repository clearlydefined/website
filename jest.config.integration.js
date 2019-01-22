var config = require('./jest.config')
config.setupTestFrameworkScriptFile = '<rootDir>/src/setupTests.js'
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
