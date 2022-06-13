Cypress.Commands.add('gui_login', (email, password) => {
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password, { log: false })
  cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('gui_signUp', (name, email, password) => {
  cy.get('[data-testid="nome"]').type(name)
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(password)
  cy.get('[data-testid="cadastrar"]').click()
})

Cypress.Commands.add('guiAdminLogin', (admin) => {
  cy.intercept('POST', '**/login').as('login')
  cy.session(admin, () => {
    cy.visit(Cypress.env('frontUrl') + '/login')
    cy.createUserApi(admin)
    cy.gui_login(admin.email, admin.password)
    cy.wait('@login')
    cy.visit(Cypress.env('frontUrl') + '/admin/home')
  })
})
