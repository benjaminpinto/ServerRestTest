describe('E2E GUI login tests', () => {
  const user = Cypress.env('user')
  const admin = Cypress.env('admin')

  beforeEach(() => {
    cy.visit('https://front.serverest.dev/')
  })

  context('Visibility and state of elements', () => {
    it("Check initial state of page's elements", () => {
      cy.findByRole('img').should('be.visible')
      cy.findByRole('heading', { level: 1 })
        .should('be.visible')
        .and('contain.text', 'Login')
      cy.findByTestId('email')
        .should('be.visible')
        .and('be.empty')
      cy.findByTestId('senha')
        .should('be.visible')
        .and('be.empty')
      cy.findByTestId('entrar')
        .should('be.visible')
        .and('be.enabled')
      cy.findByText('Não é cadastrado?').should('be.visible')
      cy.findByText('Cadastre-se').should('be.visible')
    })
  })

  it('Verify invalid e-mail message', () => {
    cy.gui_login('invalid-email.com', 'any-pass')
    cy.findByTestId('email')
      .invoke('prop', 'validity')
      .should('deep.include', {
        valid: false,
      })
  })

  context('Do login', () => {
    it('with empty credentials', () => {
      cy.findByTestId('entrar').click()
      cy.findByText('Email é obrigatório').should('be.visible')
      cy.findByText('Password é obrigatório').should('be.visible')
    })

    it('with wrong credentials', () => {
      cy.gui_login('wrong@email.com', 'wrong-password')
      cy.findByText('Email e/ou senha inválidos').should('be.visible')
    })

    // Creates an user with API. Skip if already exists (failOnStatusCode: false)
    it('with right user credentials', () => {
      cy.createUserApi(user)
      cy.gui_login(user.email, user.password)
      cy.findByText('Serverest Store').should('be.visible')
    })

    // Creates an admin with API. Skip if already exists (failOnStatusCode: false)
    it.only('with right admin credentials', () => {
      cy.createUserApi(admin)
      cy.gui_login(admin.email, admin.password)
      cy.findByText(/Bem Vindo/i).should('be.visible')
    })
  })
})
