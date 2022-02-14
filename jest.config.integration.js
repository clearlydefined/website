var config = require('./jest.config')
config.setupFilesAfterEnv = ['<rootDir>/src/setupTests.js']
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
