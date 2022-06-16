describe('Tests from products page', () => {
  beforeEach(() => {
    cy.guiAdminLogin(Cypress.env('admin'))
    cy.visit(Cypress.env('frontUrl') + '/admin/home')
    cy.get('[data-testid="cadastrarProdutos"]').click()
  })

  const nameField = '[data-testid="nome"]'
  const priceField = '[data-testid="preco"]'
  const descriptionField = '[data-testid="descricao"]'
  const quantityField = '[data-testid="quantity"]'
  const btnCadastrar = '[data-testid="cadastarProdutos"]'

  const faker = require('faker-br')

  it('Check page elements', () => {
    cy.contains('Cadastro de Produtos').should('be.visible')
    cy.get(nameField)
      .should('be.visible')
      .and('be.empty')
    cy.get(priceField)
      .should('be.visible')
      .and('be.empty')
    cy.get(descriptionField)
      .should('be.visible')
      .and('be.empty')
    cy.get(quantityField)
      .should('be.visible')
      .and('be.empty')
    cy.get(btnCadastrar)
      .should('be.visible')
      .and('be.enabled')
  })

  it('Tries to insert product with blank fields', () => {
    cy.get(btnCadastrar).click()
    cy.findByText(/Nome é obrigatório/i).should('be.visible')
    cy.findByText(/Preco é obrigatório/i).should('be.visible')
    cy.findByText(/Descricao é obrigatório/i).should('be.visible')
    cy.findByText(/Quantidade é obrigatório/i).should('be.visible')
  })

  it.skip('Tries to insert a product without image - Not passing (issue opened)', () => {
    cy.get(nameField).type(faker.commerce.productName())
    cy.get(priceField).type(faker.commerce.price())
    cy.get(descriptionField).type(faker.lorem.paragraph())
    cy.get(quantityField).type(faker.random.number())
    cy.get(btnCadastrar).click()
    cy.findByText(/Imagem é obrigatório/i).should('be.visible')
  })
})
