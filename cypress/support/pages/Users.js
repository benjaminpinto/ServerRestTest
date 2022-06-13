export class Users {
  fillForm(user) {
    cy.get('[data-testid="nome"]').type(user.name)
    cy.get('[data-testid="email"]').type(user.email)
    cy.get('[data-testid="password"]').type(user.password)
  }
}

export const onUsersPage = new Users()
