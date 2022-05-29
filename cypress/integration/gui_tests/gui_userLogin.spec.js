describe('E2E GUI login tests', () => {
  const user = Cypress.env('user')
  const admin = Cypress.env('admin')

  beforeEach(() => {
    cy.visit('https://front.serverest.dev/')
  })

  context('Visibility and state of elements', () => {
    it("Check initial state of page's elements", () => {
      cy.get('.form').should('be.visible').and('contain.text', 'Login')
      cy.get('.imagem').should('be.visible')
      cy.get('[data-testid="email"]').should('be.visible').and('be.empty')
      cy.get('[data-testid="senha"]').should('be.visible').and('be.empty')
      cy.get('[data-testid="entrar"]').should('be.visible').and('be.enabled')
      cy.get('.message')
        .should('contain.text', 'Não é cadastrado?')
        .children()
        .should('have.attr', 'data-testid', 'cadastrar')
    })
  })

  it('Verify invalid e-mail message', () => {
    cy.gui_login('invalid-email.com', 'any-pass')
    cy.get('#email.form-control')
      .invoke('prop', 'validity')
      .should('deep.include', {
        valid: false,
      })
  })

  context('Do login', () => {
    it('with empty credentials', () => {
      cy.get('[data-testid="entrar"]').click()
      cy.contains('Email é obrigatório')
      cy.contains('Password é obrigatório')
    })

    it('with wrong credentials', () => {
      cy.gui_login('wrong@email.com', 'wrong-password')
      cy.contains('Email e/ou senha inválidos')
    })

    it('with right user credentials', () => {
      cy.createUserApi()
      cy.gui_login(Cypress.env('email'), Cypress.env('password'))
      cy.get('h1').should('contain.text', 'Bem Vindo')
    })
  })
})
