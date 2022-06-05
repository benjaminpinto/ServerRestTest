describe('API Product tests', () => {
  const faker = require('faker-br')

  context('Get list and search for a product', () => {
    it('Get products list and search for the first', () => {
      cy.getProductsList().then((list) => {
        expect(list.status).to.equal(200)
        expect(list.body).be.not.empty

        cy.searchProduct(list.body.produtos[0]._id).then((product) => {
          expect(product.status).to.equal(200)
          expect(product.body.nome).to.equal(list.body.produtos[0].nome)
          expect(product.body.descricao).to.equal(
            list.body.produtos[0].descricao
          )
          expect(product.body.preco).to.equal(list.body.produtos[0].preco)
          expect(product.body.quantidade).to.equal(
            list.body.produtos[0].quantidade
          )
        })
      })
    })
  })

  context('Create a product', () => {
    const product = {
      nome: faker.commerce.productName(),
      descricao: faker.lorem.paragraph(),
      preco: faker.commerce.price(),
      quantidade: faker.random.number(),
    }
    it('Create without access token', () => {
      cy.createProductApi(product).then((response) => {
        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal(
          'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
        )
      })
    })

    it('With correct token, insert a same product 2 times (expect response code 201 and 400, respectively)', () => {
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.createProductApi(product, body.authorization).then(
          (firstResponse) => {
            expect(firstResponse.status).to.equal(201)
            expect(firstResponse.body.message).to.equal(
              'Cadastro realizado com sucesso'
            )
            cy.createProductApi(product, body.authorization).then(
              (secondResponse) => {
                expect(secondResponse.status).to.equal(400)
                expect(secondResponse.body.message).to.equal(
                  'Já existe produto com esse nome'
                )
              }
            )
          }
        )
      })
    })
  })
})
