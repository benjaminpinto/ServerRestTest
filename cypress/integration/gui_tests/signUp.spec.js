var faker = require('faker-br')

describe('E2E GUI SignUp', () => {
  beforeEach(() => {
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
  })

  it("Check page's elements visibility, state and expected behaviors", () => {
    cy.get('#nome').should('be.visible').and('be.empty')
    cy.get('#email').should('be.visible').and('be.empty')
    cy.get('#password').should('be.visible').and('be.empty')
    cy.get('#administrador').should('be.visible').and('be.not.checked')
    cy.get('[data-testid="cadastrar"]').should('be.visible').and('be.enabled')
    cy.contains('Já é cadastrado?').should('be.visible')
    cy.get('[data-testid="entrar"]').should('be.visible')
  })

  it('Check error messages when let blank fields', () => {
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('Nome é obrigatório').should('be.visible')
    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
  })

  it('Check error messages when let invalid e-mail', () => {
    cy.get('#email').clear().type('invalid-email.com')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('#email.form-control')
      .invoke('prop', 'validity')
      .should('deep.include', {
        valid: false,
      })
  })

  it('Signup', () => {
    const userName = faker.internet.userName()
    const userEmail = faker.internet.email()
    const userPassword = faker.internet.password()

    cy.intercept('POST', '**/login').as('login')

    // Signup for the first time
    cy.gui_signUp(userName, userEmail, userPassword)
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.wait('@login')
    cy.get('h1').should('contain.text', 'Serverest Store')

    // Logout and try to signup with the same credentials
    cy.get('[data-testid="logout"]').should('be.visible').click()
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
    cy.gui_signUp(userName, userEmail, userPassword)
    cy.contains('Este email já está sendo usado').should('be.visible')
  })
})
