
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'server/**/*.ts',
    '!server/tests/**',
    '!server/**/*.d.ts',
    '!server/index.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/server/tests/setup.ts'],
  moduleNameMapping: {
    '^@server/(.*)$': '<rootDir>/server/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  testTimeout: 10000,
};
