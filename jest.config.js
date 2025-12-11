export default {
  testEnvironment: "jsdom",
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)", 
  ],
};