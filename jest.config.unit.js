var config = require('./jest.config')
config.testRegex = 'test.unit\\.js$' //Overriding testRegex option
console.log('RUNNING UNIT TESTS')
module.exports = config
