const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx,coffee}",
    baseUrl: "http://localhost",
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
});
