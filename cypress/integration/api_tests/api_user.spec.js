const faker = require('faker-br')

const user = {
  nome: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: 'true',
}

const product = {
  nome: faker.commerce.productName(),
  preco: faker.commerce.price(),
  descricao: faker.commerce.product(),
  quantidade: faker.random.number(),
}

context('API - Get list and Search users', () => {
  it("Get user's list, then seach for the first using his ID", () => {
    cy.getUsersList().then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).be.not.empty

      cy.searchUser(response.body.usuarios[0]._id).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.nome).be.not.empty
        expect(response.body.email).be.not.empty
        expect(response.body.password).be.not.empty
      })
    })
  })
})

context('API - Creating an user', () => {
  it('Check creating an user for the 1st time', () => {
    cy.createUserApi(user).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })
  it('Attempting to create the same user', () => {
    cy.createUserApi(user).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
      cy.log(user)
    })
  })
})
