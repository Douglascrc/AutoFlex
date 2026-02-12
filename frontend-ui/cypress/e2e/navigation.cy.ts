/// <reference types="cypress" />

describe('Navigation and Integration E2E Tests', () => {
  beforeEach(() => {
    cy.clearDatabase();
    cy.visit('/');
  });

  describe('Navigation', () => {
    it('should navigate between Products and Raw Materials tabs', () => {
      cy.contains('AutoFlex').should('be.visible');

      cy.contains('button', 'Matérias-Primas').click();
      cy.contains('button.nav-btn.active', 'Matérias-Primas').should('exist');

      cy.contains('button', 'Produtos').click();
      cy.contains('button.nav-btn.active', 'Produtos').should('exist');
    });

    it('should maintain state when switching tabs', () => {
      cy.createProduct({
        name: 'Produto Teste',
        description: 'Teste de navegação',
        price: 100.00,
      });

      cy.visit('/');
      cy.contains('Produto Teste').should('be.visible');

      cy.contains('button', 'Matérias-Primas').click();
      cy.contains('button.nav-btn.active', 'Matérias-Primas').should('exist');

      cy.contains('button', 'Produtos').click();

      cy.contains('Produto Teste').should('be.visible');
    });
  });

  describe('Product and Raw Material Association', () => {
    it('should associate raw material to product successfully', () => {

      cy.createRawMaterial({
        name: 'Aço',
        currentStock: 200,
      }).then((rawMaterial) => {

        cy.createProduct({
          name: 'Estrutura Metálica',
          description: 'Estrutura resistente',
          price: 1500.00,
        }).then((product) => {

          cy.associateRawMaterial(product.id, rawMaterial.id, 25);


          cy.visit('/');
          cy.contains('button', 'Produtos Disponíveis').click();
          cy.contains('Estrutura Metálica').should('be.visible');
        });
      });
    });

    it('should handle association with multiple raw materials', () => {
      let product: any;


      cy.createProduct({
        name: 'Cadeira Completa',
        description: 'Cadeira com todos componentes',
        price: 800.00,
      }).then((p) => {
        product = p;
      });

      cy.createRawMaterial({
        name: 'Plástico',
        currentStock: 100,
      }).then((plastico) => {
        cy.associateRawMaterial(product.id, plastico.id, 15);
      });

      cy.createRawMaterial({
        name: 'Parafusos',
        currentStock: 500,
      }).then((parafusos) => {
        cy.associateRawMaterial(product.id, parafusos.id, 20);
      });

      cy.createRawMaterial({
        name: 'Espuma',
        currentStock: 50,
      }).then((espuma) => {
        cy.associateRawMaterial(product.id, espuma.id, 5);
      });

      // Verificar que pode ser produzido
      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Cadeira Completa').should('be.visible');
    });
  });

  describe('Complete Workflow', () => {
    it('should complete a full product lifecycle', () => {

      cy.contains('button', 'Matérias-Primas').click();
      cy.contains('button', 'Nova Matéria-Prima').click();
      cy.get('input[name="name"]').type('Couro');
      cy.get('input[name="currentStock"]').type('80');
      cy.contains('button', 'Salvar').click();
      cy.contains('Couro').should('be.visible');


      cy.contains('button', 'Produtos').click();
      cy.contains('button', 'Novo Produto').click();
      cy.get('input[name="name"]').type('Sofá de Couro');
      cy.get('input[name="description"]').type('Sofá luxuoso');
      cy.get('input[name="price"]').type('3500.00');
      cy.contains('button', 'Salvar').click();
      cy.contains('Sofá de Couro').should('be.visible');


      cy.request('GET', `${Cypress.env('apiUrl')}/products`).then((response) => {
        const sofa = response.body.find((p: any) => p.name === 'Sofá de Couro');

        cy.request('GET', `${Cypress.env('apiUrl')}/raw-materials`).then((rmResponse) => {
          const couro = rmResponse.body.find((rm: any) => rm.name === 'Couro');

          cy.associateRawMaterial(sofa.id, couro.id, 10);
        });
      });

      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Sofá de Couro').should('be.visible');
      cy.contains('R$ 3.500,00').should('be.visible');
    });

    it('should handle product deletion cascade', () => {
      let productId: number;
      let rawMaterialId: number;

      cy.createRawMaterial({
        name: 'Fibra de Carbono',
        currentStock: 60,
      }).then((rm) => {
        rawMaterialId = rm.id;

        cy.createProduct({
          name: 'Peça Especial',
          description: 'Peça de alta tecnologia',
          price: 5000.00,
        }).then((p) => {
          productId = p.id;
          cy.associateRawMaterial(productId, rawMaterialId, 8);
        });
      });

      cy.visit('/');

      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Peça Especial').should('be.visible');

      cy.contains('button', 'Produtos').click();
      cy.contains('tr', 'Peça Especial').within(() => {
        cy.get('button').contains('Deletar').click();
      });
      cy.contains('button', 'Confirmar').click();

      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Peça Especial').should('not.exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/products', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('getProductsError');

      cy.visit('/');
      cy.wait('@getProductsError');

    });

    it('should handle concurrent operations', () => {
      const products = [
        { name: 'P1', description: 'D1', price: 100 },
        { name: 'P2', description: 'D2', price: 200 },
        { name: 'P3', description: 'D3', price: 300 },
      ];

      products.forEach((p) => cy.createProduct(p));

      cy.visit('/');

      cy.contains('P1').should('be.visible');
      cy.contains('P2').should('be.visible');
      cy.contains('P3').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667); // iPhone SE

      cy.visit('/');

      cy.contains('button', 'Novo Produto').should('be.visible');
      cy.contains('button', 'Matérias-Primas').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024); // iPad

      cy.visit('/');

      cy.contains('AutoFlex').should('be.visible');
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across page reloads', () => {
      cy.createProduct({
        name: 'Produto Persistente',
        description: 'Deve permanecer após reload',
        price: 250.00,
      });

      cy.visit('/');
      cy.contains('Produto Persistente').should('be.visible');

      // Reload
      cy.reload();

      cy.contains('Produto Persistente').should('be.visible');
    });
  });
});

