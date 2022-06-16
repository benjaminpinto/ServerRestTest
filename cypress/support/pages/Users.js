export class Users {
  fillForm(user) {
    cy.findByTestId('nome').type(user.name)
    cy.findByTestId('email').type(user.email)
    cy.findByTestId('password').type(user.password)
  }
}

export const onUsersPage = new Users()
