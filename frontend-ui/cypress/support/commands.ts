/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      clearDatabase(): Chainable<void>;

      createProduct(product: { name: string; description: string; price: number }): Chainable<any>;

      createRawMaterial(rawMaterial: {
        name: string;
        currentStock: number;
        description?: string;
        cost?: number;
      }): Chainable<any>;

      associateRawMaterial(productId: number, rawMaterialId: number, quantity: number): Chainable<any>;
    }
  }
}

Cypress.Commands.add('clearDatabase', () => {
  const apiUrl = Cypress.env('apiUrl');

  cy.request({
    method: 'GET',
    url: `${apiUrl}/products`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.body && Array.isArray(response.body)) {
      response.body.forEach((product: any) => {
        cy.request({
          method: 'DELETE',
          url: `${apiUrl}/products/${product.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });


  cy.request({
    method: 'GET',
    url: `${apiUrl}/raw-materials`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.body && Array.isArray(response.body)) {
      response.body.forEach((rawMaterial: any) => {
        cy.request({
          method: 'DELETE',
          url: `${apiUrl}/raw-materials/${rawMaterial.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });


  cy.wait(500);
});

Cypress.Commands.add('createProduct', (product) => {
  const apiUrl = Cypress.env('apiUrl');

  return cy.request({
    method: 'POST',
    url: `${apiUrl}/products`,
    body: product,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

Cypress.Commands.add('createRawMaterial', (rawMaterial) => {
  const apiUrl = Cypress.env('apiUrl');

  return cy.request({
    method: 'POST',
    url: `${apiUrl}/raw-materials`,
    body: {
      name: rawMaterial.name,
      description: rawMaterial.description || 'Test description',
      cost: rawMaterial.cost || 10.0,
      currentStock: rawMaterial.currentStock
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

Cypress.Commands.add('associateRawMaterial', (productId, rawMaterialId, quantity) => {
  const apiUrl = Cypress.env('apiUrl');

  return cy.request({
    method: 'POST',
    url: `${apiUrl}/products/${productId}/raw-materials`,
    body: {
      rawMaterialId: rawMaterialId,
      quantity: quantity,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body;
  });
});

export {};

