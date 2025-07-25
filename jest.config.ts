module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"]
}
