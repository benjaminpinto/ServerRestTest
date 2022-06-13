export class Products {
  fillForm() {
    var faker = require('faker')

    cy.get('[data-testid="nome"]').type(faker.commerce.productName())
    cy.get('[data-testid="price"]').type(faker.commerce.price())
    cy.get('[data-testid="description"]').type(faker.lorem.paragraph())
    cy.get('[data-testid="quantity"]').type(faker.random.number())
    cy.get('[data-testid="imagem"]').selectFile('../../fixtures/Anel.jpg')
  }
}

export const onProductsPage = new Products()
