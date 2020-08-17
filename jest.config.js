module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js", "tsx", "json"],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  modulePathIgnorePatterns: [],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
