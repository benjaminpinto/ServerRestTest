const apiUrl = 'https://serverest.dev'
const usersUrl = `${apiUrl}/usuarios`
const productsUrl = `${apiUrl}/produtos`
const loginUrl = `${apiUrl}/login`

Cypress.Commands.add('createUserApi', (user) => {
  cy.request({
    method: 'POST',
    failOnStatusCode: false,
    url: usersUrl,
    body: {
      nome: user.name,
      email: user.email,
      password: user.password,
      administrador: user.administrador,
    },
  })
})

// Pegar o token do login
Cypress.Commands.add('loginApi', (user) => {
  cy.request({
    method: 'POST',
    url: loginUrl,
    body: {
      email: user.email,
      password: user.password,
    },
  })
})

Cypress.Commands.add('createProductApi', (product) => {
  cy.request({
    method: 'POST',
    url: productsUrl,
    body: {
      nome: product.nome,
      preco: product.preco,
      descricao: product.descricao,
      quantidade: product.quantidade,
    },
  })
})

Cypress.Commands.add('getUsersList', () => {
  cy.request({
    method: 'GET',
    url: usersUrl,
  })
})

Cypress.Commands.add('deleteUser', (userId) => {
  cy.request({
    method: 'DELETE',
    url: `${usersUrl}/${userId}`,
  })
})

Cypress.Commands.add('searchUser', (id) => {
  cy.request({
    method: 'GET',
    url: `${usersUrl}/${id}`,
  })
})

Cypress.Commands.add('editUser', (userID, editedUser) => {
  cy.request({
    method: 'PUT',
    url: `${usersUrl}/${userID}`,
    body: editedUser,
    failOnStatusCode: false,
  })
})
