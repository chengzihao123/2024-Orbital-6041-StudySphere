import type { Config } from &apos@jest/types&apos;

const config: Config.InitialOptions = {
  preset: &aposts-jest&apos,
  testEnvironment: &aposjsdom&apos,
  setupFilesAfterEnv: [&apos<rootDir>/jest.setup.ts&apos],
  moduleNameMapper: {
    &apos\\.(css|less|scss|sass)$&apos: &aposidentity-obj-proxy&apos,
    &apos^@/(.*)$&apos: &apos<rootDir>/src/$1&apos,
  },
  transform: {
    &apos^.+\\.(ts|tsx)$&apos: &aposts-jest&apos,
    &apos^.+\\.(js|jsx)$&apos: &aposts-jest&apos,
  },
  transformIgnorePatterns: [
    &apos/node_modules/(?!firebase/.*)&apos, // Ignore node_modules except for firebase
    &apos^.+\\.module\\.(css|sass|scss)$&apos,
  ],
  testPathIgnorePatterns: [&apos/node_modules/&apos, &apos/.next/&apos],
};

export default config;
