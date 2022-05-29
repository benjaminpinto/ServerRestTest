Cypress.Commands.add('gui_login', (email, password) => {
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password, { log: false })
  cy.get('[data-testid="entrar"]').click()
})
