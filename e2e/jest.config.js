module.exports = {
  preset: 'jest-puppeteer',
  //  testRegex: 'e2e/tests/.*\\.js$',
  testRegex: 'e2e/tests/definitions.js',
  globals: {
    __HOST__: process.env.TEST_HOST || 'http://localhost:3000'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
