module.exports = {
  preset: 'jest-puppeteer',
  testRegex: 'e2e/tests/.*\\.js$',
  globals: {
    __HOST__: process.env.NODE_ENV === 'debug' ? 'http://localhost:3333' : 'https://dev.clearlydefined.io'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
