module.exports = {
  preset: 'jest-puppeteer',
  testRegex: 'e2e/tests/.*\\.js$',
  globals: {
    __HOST__: 'http://localhost:3333'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
