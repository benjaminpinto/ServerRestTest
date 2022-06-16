var faker = require('faker-br')

describe('E2E GUI SignUp', () => {
  beforeEach(() => {
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
  })

  it("Check page's elements visibility, state and expected behaviors", () => {
    cy.findByTestId('nome')
      .should('be.visible')
      .and('be.empty')
    cy.findByTestId('email')
      .should('be.visible')
      .and('be.empty')
    cy.findByTestId('password')
      .should('be.visible')
      .and('be.empty')
    cy.findByTestId('checkbox')
      .should('be.visible')
      .and('be.not.checked')
    cy.findByTestId('cadastrar')
      .should('be.visible')
      .and('be.enabled')
    cy.findByText('Já é cadastrado?').should('be.visible')
    cy.findByTestId('entrar').should('be.visible')
  })

  it('Check error messages when let blank fields', () => {
    cy.findByTestId('cadastrar').click()
    cy.findByText(/Nome é obrigatório/i).should('be.visible')
    cy.findByText(/Email é obrigatório/i).should('be.visible')
    cy.findByText(/Password é obrigatório/i).should('be.visible')
  })

  it('Check error messages when let invalid e-mail', () => {
    cy.findByTestId('email')
      .clear()
      .type('invalid-email.com')
    cy.findByTestId('cadastrar').click()
    cy.findByTestId('email')
      .invoke('prop', 'validity')
      .should('deep.include', {
        valid: false,
      })
  })

  it.only('Signup', () => {
    const userName = faker.internet.userName()
    const userEmail = faker.internet.email()
    const userPassword = faker.internet.password()

    cy.intercept('POST', '**/login').as('login')

    // Signup for the first time
    cy.gui_signUp(userName, userEmail, userPassword)
    cy.findByText(/Cadastro realizado com sucesso/i).should('be.visible')
    cy.wait('@login')
    cy.findByText(/Serverest Store/i).should('be.visible')

    // Logout and try to signup with the same credentials
    cy.findByTestId('logout')
      .should('be.visible')
      .click()
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
    cy.gui_signUp(userName, userEmail, userPassword)
    cy.findByText(/Este email já está sendo usado/i).should('be.visible')
  })
})
