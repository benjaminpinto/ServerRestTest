const faker = require('faker-br')

describe('Tests from Admins home', () => {
  const admin = Cypress.env('admin')

  beforeEach(() => {
    cy.guiAdminLogin(admin)
    cy.visit('https://front.serverest.dev/admin/home')
  })

  it('Visibility of main elements', () => {
    cy.get('h1').should('contain.text', `Bem Vindo  ${admin.name}`)
    cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible')
    cy.get('[data-testid="listarUsuarios"]').should('be.visible')
    cy.get('[data-testid="cadastrarProdutos"]').should('be.visible')
    cy.get('[data-testid="listarProdutos"]').should('be.visible')
    cy.get('[data-testid="relatorios"]').should('be.visible')
  })

  context('Create user', () => {
    const nomeField = '[data-testid="nome"]'
    const emailField = '[data-testid="email"]'
    const passwordField = '[data-testid="password"]'
    const btnCadastrar = '[data-testid="cadastrarUsuario"]'
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    beforeEach(() => {
      cy.get('[data-testid="cadastrarUsuarios"]').click()
    })

    it('Check page elements', () => {
      cy.get(nomeField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite seu nome')
        .and('be.empty')
      cy.get(emailField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite seu email')
        .and('be.empty')
      cy.get(passwordField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite sua senha')
        .and('be.empty')
      cy.get('.form-check')
        .should('be.visible')
        .children('[data-testid="checkbox"]')
        .should('not.be.checked')
      cy.get(btnCadastrar).should('be.visible').and('have.text', 'Cadastrar')
    })

    it('Tries to insert user with blank fields', () => {
      cy.get(btnCadastrar).click()
      cy.contains('Nome é obrigatório').should('be.visible')
      cy.contains('Email é obrigatório').should('be.visible')
      cy.contains('Password é obrigatório').should('be.visible')
    })

    it('Check email validation', () => {
      cy.get(emailField).type('any_invalid@email_com;')
      cy.get(btnCadastrar).click()
      cy.get(emailField).invoke('prop', 'validity').should('deep.include', {
        valid: false,
      })
    })

    it('Include a valid user', () => {
      cy.intercept('GET', '**/usuarios').as('getUsers')

      cy.fillFormUser(user)
      cy.get(btnCadastrar).click()
      cy.wait('@getUsers')
      cy.contains(user.name)
        .should('be.visible')
        .siblings(':nth-child(4)')
        .should('contain.text', 'false')
    })

    it('Include a valid admin', () => {
      const admin = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      cy.intercept('GET', '**/usuarios').as('getUsers')

      cy.fillFormUser(admin, true)
      cy.get('[data-testid="checkbox"]').check()
      cy.get(btnCadastrar).click()
      cy.wait('@getUsers')
      cy.contains(admin.name)
        .should('be.visible')
        .siblings(':nth-child(4)')
        .should('contain.text', 'true')
    })
  })
})
