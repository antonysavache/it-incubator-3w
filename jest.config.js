/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: ".*\\.e2e\\.test\\.ts$",
    setupFilesAfterEnv: ['./jest-setup.config.ts']
}