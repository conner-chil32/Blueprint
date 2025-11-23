import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Backend project config (ESM support for Node environment)
const backendProject = {
  displayName: 'backend',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lib/tests/back-end/**/*.test.js'],
  transform: {},
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@root/(.*)$': '<rootDir>/src/app/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
  },
}

// Frontend project config (Next.js with React/JSX support)
const frontendProject = {
  displayName: 'frontend',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/lib/tests/front-end/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  injectGlobals: true,
  extensionsToTreatAsEsm: ['.jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library)/)',
  ],
  moduleNameMapper: {
    // Path aliases
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@root/(.*)$': '<rootDir>/src/app/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    // CSS module mocking
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}

// Main config with projects
const config = {
  coverageProvider: 'v8',
  projects: [backendProject, frontendProject],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
