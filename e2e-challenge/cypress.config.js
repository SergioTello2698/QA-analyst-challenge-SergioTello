const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: "https://login.hyphalab.dev",
    screenshotOnRunFailure: true,
    video: true,
  },
});