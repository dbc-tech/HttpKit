export default {
  testEnvironment: 'node',
  // eslint-disable-next-line prettier/prettier, no-useless-escape
  testRegex: '.*\.test.?.ts$',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./setupTests.ts'],
};
