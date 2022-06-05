const apiUrl = 'https://serverest.dev'
const usersUrl = `${apiUrl}/usuarios`
const productsUrl = `${apiUrl}/produtos`
const loginUrl = `${apiUrl}/login`

// Catch login token with then() after call this function
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

/*  SECTION
 *  API USERS COMMANDS
 */
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

/* SECTION
 * API PRODUCTS COMMANDS
 */

Cypress.Commands.add('getProductsList', () => {
  cy.request({
    method: 'GET',
    url: productsUrl,
  })
})

Cypress.Commands.add('searchProduct', (id) => {
  cy.request({
    method: 'GET',
    failOnStatusCode: false,
    url: `${productsUrl}/${id}`,
  })
})

Cypress.Commands.add('createProductApi', (product, token = null) => {
  cy.request({
    method: 'POST',
    url: productsUrl,
    failOnStatusCode: false,
    headers: { Authorization: token },
    body: {
      nome: product.nome,
      preco: product.preco,
      descricao: product.descricao,
      quantidade: product.quantidade,
    },
  })
})

Cypress.Commands.add('deleteProductApi', (productId, token = null) => {
  cy.request({
    method: 'DELETE',
    url: `${productsUrl}/${productId}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add(
  'updateProductApi',
  (productId, editedProduct, token = null) => {
    cy.request({
      method: 'PUT',
      url: `${productsUrl}/${productId}`,
      headers: { Authorization: token },
      body: editedProduct,
      failOnStatusCode: false,
    })
  }
)
