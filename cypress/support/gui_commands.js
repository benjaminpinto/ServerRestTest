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
    cy.visit('https://front.serverest.dev/login')
    cy.createUserApi(admin)
    cy.gui_login(admin.email, admin.password)
    cy.wait('@login')
    cy.visit('https://front.serverest.dev/admin/home')
  })
})

Cypress.Commands.add('fillFormUser', (user) => {
  cy.get('[data-testid="nome"]').type(user.name)
  cy.get('[data-testid="email"]').type(user.email)
  cy.get('[data-testid="password"]').type(user.password)
})
