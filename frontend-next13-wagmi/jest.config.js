
const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/common/(.*)$': '<rootDir>/src/common/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(wagmi|@wagmi|viem|@rainbow-me|@tanstack|@uniswap)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   moduleNameMapper: {
//     '^@/config/(.*)$': '<rootDir>/src/config/$1',
//     '^@/components/(.*)$': '<rootDir>/src/components/$1',
//     '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
//     '^@/common/(.*)$': '<rootDir>/src/common/$1',
//     '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
//     '^@/app/(.*)$': '<rootDir>/src/app/$1',
//     '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
//   },
//   transform: {
//     '^.+\\.(ts|tsx)$': ['ts-jest', {
//       tsconfig: 'tsconfig.json',
//       jsx: 'react-jsx',
//     }],
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   transformIgnorePatterns: [
//     '/node_modules/(?!(wagmi|@wagmi|viem|@rainbow-me|@tanstack)/)',
//     '^.+\\.module\\.(css|sass|scss)$',
//   ],
//   testMatch: [
//     '<rootDir>/test/**/*.test.(ts|tsx)',
//     '<rootDir>/components/**/*.test.(ts|tsx)',
//   ],
//   collectCoverage: true,
//   collectCoverageFrom: [
//     'components/**/*.{ts,tsx}',
//     'hooks/**/*.{ts,tsx}',
//     '!**/*.d.ts',
//     '!**/node_modules/**',
//   ],
//   coverageThreshold: {
//     global: {
//       branches: 70,
//       functions: 70,
//       lines: 70,
//       statements: 70,
//     },
//   },
// };

module.exports = createJestConfig(customJestConfig);