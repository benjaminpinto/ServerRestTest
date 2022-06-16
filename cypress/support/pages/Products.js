export class Products {
  fillForm() {
    var faker = require('faker')

    cy.findByTestId('nome').type(faker.commerce.productName())
    cy.findByTestId('price').type(faker.commerce.price())
    cy.findByTestId('description').type(faker.lorem.paragraph())
    cy.findByTestId('quantity').type(faker.random.number())
    cy.findByTestId('imagem').selectFile('../../fixtures/Anel.jpg')
  }
}

export const onProductsPage = new Products()
