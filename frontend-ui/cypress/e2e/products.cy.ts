/// <reference types="cypress" />

describe('Products E2E Tests', () => {
  beforeEach(() => {
    cy.clearDatabase();
    cy.visit('/');
  });

  describe('Product List', () => {
    it('should display empty state when no products exist', () => {
      cy.contains('Nenhum produto cadastrado').should('be.visible');
      cy.contains('Adicione seu primeiro produto para começar').should('be.visible');
    });

    it('should display product list correctly', () => {
      const products = [
        { name: 'Produto A', description: 'Descrição A', price: 100.00 },
        { name: 'Produto B', description: 'Descrição B', price: 200.00 },
        { name: 'Produto C', description: 'Descrição C', price: 300.00 },
      ];

      products.forEach((product) => cy.createProduct(product));

      cy.visit('/');

      // Verificar que todos os produtos estão visíveis
      cy.contains('Produto A').should('be.visible');
      cy.contains('Produto B').should('be.visible');
      cy.contains('Produto C').should('be.visible');

      // Verificar preços formatados
      cy.contains('R$ 100,00').should('be.visible');
      cy.contains('R$ 200,00').should('be.visible');
      cy.contains('R$ 300,00').should('be.visible');
    });
  });

  describe('Create Product', () => {
    it('should create a new product successfully', () => {
      cy.contains('button', 'Novo Produto').click();

      cy.get('input[name="name"]').type('Cadeira Executiva');
      cy.get('input[name="description"]').type('Cadeira ergonômica com apoio lombar');
      cy.get('input[name="price"]').type('450.50');

      cy.contains('button', 'Salvar').click();

      cy.contains('Cadeira Executiva').should('be.visible');
      cy.contains('Cadeira ergonômica com apoio lombar').should('be.visible');
      cy.contains('R$ 450,50').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.contains('button', 'Novo Produto').click();

      cy.contains('button', 'Salvar').click();

      cy.get('input[name="name"]').should('have.attr', 'required');
      cy.get('input[name="price"]').should('have.attr', 'required');
    });

    it('should validate price format', () => {
      cy.contains('button', 'Novo Produto').click();

      cy.get('input[name="name"]').type('Produto Teste');
      cy.get('input[name="description"]').type('Descrição teste');
      cy.get('input[name="price"]').type('999.99');

      cy.contains('button', 'Salvar').click();
      cy.contains('R$ 999,99').should('be.visible');
    });

    it('should close modal on cancel', () => {
      cy.contains('button', 'Novo Produto').click();

      cy.get('input[name="name"]').should('be.visible');

      cy.contains('button', 'Cancelar').click();

      cy.get('input[name="name"]').should('not.exist');
    });
  });

  describe('Update Product', () => {
    it('should update an existing product', () => {
      cy.createProduct({
        name: 'Mesa de Escritório',
        description: 'Mesa em MDF',
        price: 350.00,
      });

      cy.visit('/');
      cy.contains('Mesa de Escritório').should('be.visible');

      cy.contains('tr', 'Mesa de Escritório').within(() => {
        cy.get('button').contains('Editar').click();
      });

      cy.get('input[name="name"]').clear().type('Mesa Premium');
      cy.get('input[name="price"]').clear().type('500.00');

      cy.contains('button', 'Salvar').click();

      cy.contains('Mesa Premium').should('be.visible');
      cy.contains('R$ 500,00').should('be.visible');
      cy.contains('Mesa de Escritório').should('not.exist');
    });

    it('should preserve unchanged fields when updating', () => {
      cy.createProduct({
        name: 'Produto Original',
        description: 'Descrição Original',
        price: 100.00,
      });

      cy.visit('/');

      cy.contains('tr', 'Produto Original').within(() => {
        cy.get('button').contains('Editar').click();
      });

      cy.get('input[name="price"]').clear().type('200.00');
      cy.contains('button', 'Salvar').click();

      cy.contains('Produto Original').should('be.visible');
      cy.contains('Descrição Original').should('be.visible');
      cy.contains('R$ 200,00').should('be.visible');
    });
  });

  describe('Delete Product', () => {
    it('should delete a product with confirmation', () => {
      cy.createProduct({
        name: 'Produto Temporário',
        description: 'Será deletado',
        price: 100.00,
      });

      cy.visit('/');
      cy.contains('Produto Temporário').should('be.visible');

      cy.contains('tr', 'Produto Temporário').within(() => {
        cy.get('button').contains('Deletar').click();
      });

      cy.contains('button', 'Confirmar').click();

      cy.contains('Produto Temporário').should('not.exist');
      cy.contains('Nenhum produto cadastrado').should('be.visible');
    });

    it('should cancel deletion when clicking cancel', () => {
      cy.createProduct({
        name: 'Produto Permanente',
        description: 'Não será deletado',
        price: 100.00,
      });

      cy.visit('/');

      cy.contains('tr', 'Produto Permanente').within(() => {
        cy.get('button').contains('Deletar').click();
      });

      cy.contains('button', 'Cancelar').click();

      cy.contains('Produto Permanente').should('be.visible');
    });
  });

  describe('Product Search/Filter', () => {
    beforeEach(() => {
      const products = [
        { name: 'Cadeira Executiva', description: 'Para escritório', price: 500.00 },
        { name: 'Mesa de Reunião', description: 'Grande', price: 800.00 },
        { name: 'Cadeira Simples', description: 'Básica', price: 150.00 },
      ];

      products.forEach((product) => cy.createProduct(product));
      cy.visit('/');
    });

    it('should display all products initially', () => {
      cy.contains('Cadeira Executiva').should('be.visible');
      cy.contains('Mesa de Reunião').should('be.visible');
      cy.contains('Cadeira Simples').should('be.visible');
    });
  });
});

