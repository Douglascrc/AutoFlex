/// <reference types="cypress" />

describe('Raw Materials E2E Tests', () => {
  beforeEach(() => {
    cy.clearDatabase();
  });

  describe('Raw Material List', () => {
    it('should display empty state when no raw materials exist', () => {
      cy.visit('/');
      cy.contains('Matérias-Primas').click();

      cy.contains('Nenhuma matéria-prima cadastrada').should('be.visible');
    });

    it('should display raw materials list correctly', () => {
      const rawMaterials = [
        { name: 'Madeira', currentStock: 100 },
        { name: 'Metal', currentStock: 50 },
        { name: 'Plástico', currentStock: 200 },
      ];

      rawMaterials.forEach((rm) => cy.createRawMaterial(rm));

      cy.visit('/');
      cy.contains('Matérias-Primas').click();

      cy.contains('Madeira').should('be.visible');
      cy.contains('Metal').should('be.visible');
      cy.contains('Plástico').should('be.visible');

      cy.contains('100').should('be.visible');
      cy.contains('50').should('be.visible');
      cy.contains('200').should('be.visible');
    });
  });

  describe('Create Raw Material', () => {
    it('should create a new raw material successfully', () => {
      cy.visit('/');
      cy.contains('Matérias-Primas').click();
      cy.contains('button', 'Nova Matéria-Prima').click();

      cy.get('input[name="name"]').type('Aço Inoxidável');
      cy.get('input[name="currentStock"]').type('75');

      cy.contains('button', 'Salvar').click();

      cy.contains('Aço Inoxidável').should('be.visible');
      cy.contains('75').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.visit('/');
      cy.contains('Matérias-Primas').click();
      cy.contains('button', 'Nova Matéria-Prima').click();

      cy.contains('button', 'Salvar').click();

      cy.get('input[name="name"]').should('have.attr', 'required');
      cy.get('input[name="currentStock"]').should('have.attr', 'required');
    });

    it('should validate stock is a positive number', () => {
      cy.visit('/');
      cy.contains('Matérias-Primas').click();
      cy.contains('button', 'Nova Matéria-Prima').click();

      cy.get('input[name="name"]').type('Teste');
      cy.get('input[name="currentStock"]').type('0');

      cy.contains('button', 'Salvar').click();

      cy.contains('Teste').should('be.visible');
    });
  });

  describe('Update Raw Material', () => {
    it('should update an existing raw material', () => {
      cy.createRawMaterial({
        name: 'Alumínio',
        currentStock: 30,
      });

      cy.visit('/');
      cy.contains('Matérias-Primas').click();
      cy.contains('Alumínio').should('be.visible');

      cy.contains('tr', 'Alumínio').within(() => {
        cy.get('button').contains('Editar').click();
      });

      cy.get('input[name="currentStock"]').clear().type('150');
      cy.contains('button', 'Salvar').click();

      cy.contains('Alumínio').should('be.visible');
      cy.contains('150').should('be.visible');
      cy.contains('30').should('not.exist');
    });
  });

  describe('Delete Raw Material', () => {
    it('should delete a raw material', () => {
      cy.createRawMaterial({
        name: 'Material Temporário',
        currentStock: 10,
      });

      cy.visit('/');
      cy.contains('Matérias-Primas').click();
      cy.contains('Material Temporário').should('be.visible');

      cy.contains('tr', 'Material Temporário').within(() => {
        cy.get('button').contains('Deletar').click();
      });

      cy.contains('button', 'Confirmar').click();

      cy.contains('Material Temporário').should('not.exist');
    });
  });

  describe('Stock Management', () => {
    it('should update stock quantities correctly', () => {
      cy.createRawMaterial({
        name: 'Vidro',
        currentStock: 50,
      });

      cy.visit('/');
      cy.contains('Matérias-Primas').click();

      cy.contains('tr', 'Vidro').within(() => {
        cy.get('button').contains('Editar').click();
      });

      cy.get('input[name="currentStock"]').clear().type('100');
      cy.contains('button', 'Salvar').click();

      cy.contains('100').should('be.visible');
    });
  });
});

