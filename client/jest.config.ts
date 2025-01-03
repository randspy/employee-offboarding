import presets from 'jest-preset-angular/presets';
import type { Config } from 'jest';

const presetConfig = presets.createCjsPreset({});

const config: Config = {
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  testEnvironment: 'jsdom',
};

export default config;
