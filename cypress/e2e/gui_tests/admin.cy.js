describe('Tests from Admins home', () => {
  const admin = Cypress.env('admin')

  beforeEach(() => {
    cy.guiAdminLogin(admin)
    cy.visit(Cypress.env('frontUrl') + '/admin/home')
  })

  it('Visibility of main elements', () => {
    cy.findByRole('heading', { level: 1 }).should(
      'contain.text',
      `Bem Vindo  ${admin.name}`
    )
    cy.findByTestId('cadastrarUsuarios').should('be.visible')
    cy.findByTestId('listarUsuarios').should('be.visible')
    cy.findByTestId('cadastrarProdutos').should('be.visible')
    cy.findByTestId('listarProdutos').should('be.visible')
    cy.findByTestId('relatorios').should('be.visible')
  })
})
