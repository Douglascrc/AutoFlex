/// <reference types="cypress" />

import './commands';
import '@testing-library/cypress/add-commands';

// Disable Cypress's default behavior of failing tests on uncaught exceptions
// This is useful for React development where some errors are expected during development
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // you can customize this to only ignore specific errors if needed
  return false;
});

// Hide fetch/XHR requests in command log for cleaner output
beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
});

