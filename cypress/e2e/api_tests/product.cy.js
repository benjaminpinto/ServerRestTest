describe('API Product tests', () => {
  const faker = require('faker-br')

  context('Get list and search for a product', () => {
    it('Search for an unknown product', () => {
      cy.searchProduct('0000').then((product) => {
        expect(product.status).to.equal(400)
        expect(product.body.message).to.equal('Produto não encontrado')
      })
    })

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

    it('Create a product with non-admin user', () => {
      cy.createUserApi(Cypress.env('user'))
      cy.loginApi(Cypress.env('user')).then(({ body }) => {
        cy.createProductApi(product, body.authorization).then((response) => {
          expect(response.status).to.equal(403)
          expect(response.body.message).to.equal(
            'Rota exclusiva para administradores'
          )
        })
      })
    })
  })

  context('Delete a product', () => {
    it('Delete without valid token', () => {
      cy.deleteProductApi('0000').then((response) => {
        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal(
          'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
        )
      })
    })

    it('Delete a product with non-admin user', () => {
      cy.createUserApi(Cypress.env('user'))
      cy.loginApi(Cypress.env('user')).then(({ body }) => {
        cy.getProductsList().then((list) => {
          cy.deleteProductApi(
            list.body.produtos[0]._id,
            body.authorization
          ).then((response) => {
            expect(response.status).to.equal(403)
            expect(response.body.message).to.equal(
              'Rota exclusiva para administradores'
            )
          })
        })
      })
    })

    it('Delete a product with an admin user and valid product ID', () => {
      const productToExclude = {
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        descricao: faker.lorem.paragraph(),
        quantidade: faker.random.number(),
      }
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.createProductApi(productToExclude, body.authorization).then(
          (product) => {
            cy.deleteProductApi(product.body._id, body.authorization).then(
              (response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal(
                  'Registro excluído com sucesso'
                )
              }
            )
          }
        )
      })
    })

    it('Delete a product with an admin user and invalid product ID', () => {
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.deleteProductApi('0000', body.authorization).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Nenhum registro excluído')
        })
      })
    })

    it('Delete a product which is part of some shopping cart', () => {
      // TODO - Implement this test
    })
  })

  context('Update a product', () => {
    const updatedProduct = {
      nome: faker.commerce.productName(),
      descricao: faker.lorem.paragraph(),
      preco: faker.commerce.price(),
      quantidade: faker.random.number(),
    }

    it('Update a product with non-admin user', () => {
      cy.createUserApi(Cypress.env('user'))
      cy.loginApi(Cypress.env('user')).then(({ body }) => {
        cy.getProductsList().then((list) => {
          cy.updateProductApi(
            list.body.produtos[0]._id,
            updatedProduct,
            body.authorization
          ).then((response) => {
            expect(response.status).to.equal(403)
            expect(response.body.message).to.equal(
              'Rota exclusiva para administradores'
            )
          })
        })
      })
    })

    it('Update a product with an admin user and valid product ID', () => {
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.getProductsList().then((list) => {
          cy.updateProductApi(
            list.body.produtos[0]._id,
            updatedProduct,
            body.authorization
          ).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal(
              'Registro alterado com sucesso'
            )
          })
        })
      })

      /* NOTE - The API determines that if the product was not found by
       *         given ID, it will be created.
       */
    })
    it('Update a product with an admin user and invalid product ID (expect to insert)', () => {
      const unknownProduct = {
        nome: faker.commerce.productName(),
        descricao: faker.lorem.paragraph(),
        preco: faker.commerce.price(),
        quantidade: faker.random.number(),
      }
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.updateProductApi('0000', unknownProduct, body.authorization).then(
          (response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal(
              'Cadastro realizado com sucesso'
            )
          }
        )
      })
    })
    it('Update a product with an admin user and wrong ID and tries to insert duplicated name', () => {
      cy.createUserApi(Cypress.env('admin'))
      cy.loginApi(Cypress.env('admin')).then(({ body }) => {
        cy.updateProductApi('0000', updatedProduct, body.authorization).then(
          (response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal(
              'Já existe produto com esse nome'
            )
          }
        )
      })
    })
  })
})
