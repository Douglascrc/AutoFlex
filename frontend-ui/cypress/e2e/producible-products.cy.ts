/// <reference types="cypress" />

describe('Producible Products E2E Tests', () => {
  beforeEach(() => {
    cy.clearDatabase();
  });

  describe('Empty State', () => {
    it('should show empty state when no products exist', () => {
      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      cy.contains('Nenhum produto pode ser produzido').should('be.visible');
      cy.contains('Não há estoque suficiente').should('be.visible');
    });

    it('should show empty state when products have no raw materials', () => {
      cy.createProduct({
        name: 'Produto Sem Matérias',
        description: 'Não tem matérias-primas associadas',
        price: 500.00,
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      cy.contains('Nenhum produto pode ser produzido').should('be.visible');
    });
  });

  describe('Sufficient Stock', () => {
    it('should display producible products when stock is sufficient', () => {
      // Criar matéria-prima com estoque suficiente
      cy.createRawMaterial({
        name: 'Madeira de Lei',
        currentStock: 100,
      }).then((rawMaterial) => {
        // Criar produto
        cy.createProduct({
          name: 'Mesa de Madeira',
          description: 'Mesa artesanal',
          price: 800.00,
        }).then((product) => {
          // Associar matéria-prima ao produto (10 unidades necessárias)
          cy.associateRawMaterial(product.id, rawMaterial.id, 10);
        });
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      // Verificar que o produto aparece na lista
      cy.contains('Mesa de Madeira').should('be.visible');
      cy.contains('Mesa artesanal').should('be.visible');
      cy.contains('R$ 800,00').should('be.visible');
    });

    it('should display multiple producible products', () => {
      // Criar matérias-primas
      cy.createRawMaterial({
        name: 'Metal',
        currentStock: 200,
      }).then((metal) => {
        cy.createRawMaterial({
          name: 'Tecido',
          currentStock: 150,
        }).then((tecido) => {
          // Criar produto 1
          cy.createProduct({
            name: 'Cadeira Metálica',
            description: 'Cadeira resistente',
            price: 600.00,
          }).then((produto1) => {
            cy.associateRawMaterial(produto1.id, metal.id, 20);
          });

          // Criar produto 2
          cy.createProduct({
            name: 'Poltrona',
            description: 'Poltrona confortável',
            price: 1200.00,
          }).then((produto2) => {
            cy.associateRawMaterial(produto2.id, tecido.id, 15);
          });
        });
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      cy.contains('Cadeira Metálica').should('be.visible');
      cy.contains('Poltrona').should('be.visible');
    });
  });

  describe('Insufficient Stock', () => {
    it('should not display products with insufficient stock', () => {
      cy.createRawMaterial({
        name: 'Metal Raro',
        currentStock: 5, // Estoque insuficiente
      }).then((rawMaterial) => {
        cy.createProduct({
          name: 'Cadeira Premium',
          description: 'Cadeira de luxo',
          price: 1500.00,
        }).then((product) => {
          // Associar matéria-prima (precisa de 10, mas só tem 5)
          cy.associateRawMaterial(product.id, rawMaterial.id, 10);
        });
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      // Produto não deve aparecer
      cy.contains('Nenhum produto pode ser produzido').should('be.visible');
      cy.contains('Cadeira Premium').should('not.exist');
    });

    it('should handle products with multiple raw materials', () => {
      cy.createRawMaterial({
        name: 'Madeira',
        currentStock: 100,
      }).then((madeira) => {
        cy.createRawMaterial({
          name: 'Parafusos',
          currentStock: 5,
        }).then((parafusos) => {
          cy.createProduct({
            name: 'Estante',
            description: 'Estante de madeira',
            price: 700.00,
          }).then((product) => {
            cy.associateRawMaterial(product.id, madeira.id, 20);
            cy.associateRawMaterial(product.id, parafusos.id, 50);
          });
        });
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      // Produto não deve aparecer porque falta parafusos
      cy.contains('Estante').should('not.exist');
      cy.contains('Nenhum produto pode ser produzido').should('be.visible');
    });
  });

  describe('Mixed Scenarios', () => {
    it('should display only products with sufficient stock', () => {
      // Matéria-prima 1: suficiente
      cy.createRawMaterial({
        name: 'Plástico',
        currentStock: 100,
      }).then((plastico) => {
        // Matéria-prima 2: insuficiente
        cy.createRawMaterial({
          name: 'Vidro',
          currentStock: 5,
        }).then((vidro) => {
          // Produto 1: pode ser produzido
          cy.createProduct({
            name: 'Cadeira Plástica',
            description: 'Cadeira simples',
            price: 150.00,
          }).then((produto1) => {
            cy.associateRawMaterial(produto1.id, plastico.id, 10);
          });

          // Produto 2: NÃO pode ser produzido
          cy.createProduct({
            name: 'Mesa de Vidro',
            description: 'Mesa moderna',
            price: 900.00,
          }).then((produto2) => {
            cy.associateRawMaterial(produto2.id, vidro.id, 20);
          });
        });
      });

      cy.visit('/');
      cy.contains('button', 'Produtos Disponíveis').click();

      // Apenas Cadeira Plástica deve aparecer
      cy.contains('Cadeira Plástica').should('be.visible');
      cy.contains('Mesa de Vidro').should('not.exist');
    });
  });

  describe('UI Behavior', () => {
    it('should refresh list when returning from producible view', () => {
      cy.createRawMaterial({
        name: 'Borracha',
        currentStock: 50,
      }).then((rawMaterial) => {
        cy.createProduct({
          name: 'Tapete',
          description: 'Tapete antiderrapante',
          price: 80.00,
        }).then((product) => {
          cy.associateRawMaterial(product.id, rawMaterial.id, 5);
        });
      });

      cy.visit('/');

      // Ver producíveis
      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Tapete').should('be.visible');

      // Voltar para lista geral usando navegação
      cy.contains('button', 'Produtos').click();

      // Ver producíveis novamente
      cy.contains('button', 'Produtos Disponíveis').click();
      cy.contains('Tapete').should('be.visible');
    });
  });
});

