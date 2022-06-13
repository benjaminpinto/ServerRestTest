describe('Tests from Admins home', () => {
  const admin = Cypress.env('admin')

  beforeEach(() => {
    cy.guiAdminLogin(admin)
    cy.visit(Cypress.env('frontUrl') + '/admin/home')
  })

  it('Visibility of main elements', () => {
    cy.get('h1').should('contain.text', `Bem Vindo  ${admin.name}`)
    cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible')
    cy.get('[data-testid="listarUsuarios"]').should('be.visible')
    cy.get('[data-testid="cadastrarProdutos"]').should('be.visible')
    cy.get('[data-testid="listarProdutos"]').should('be.visible')
    cy.get('[data-testid="relatorios"]').should('be.visible')
  })
})
