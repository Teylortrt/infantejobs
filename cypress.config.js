const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // O frontend é estático; servimos os arquivos de `frontend/` localmente
    // (veja o script `npm run serve:frontend`) antes de rodar os testes.
    baseUrl: "http://localhost:5500",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
  },
});
