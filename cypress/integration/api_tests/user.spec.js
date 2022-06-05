const faker = require('faker-br')

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: 'true',
}

context('API - Get list and Search users', () => {
  it('Get user\'s list, then search for the first using his ID', () => {
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

context('Deleting an user', () => {
  it('Getting users list then, deleting the first', () => {
    cy.getUsersList().then((users) => {
      expect(users.status).to.equal(200)
      expect(users.body).be.not.empty

      cy.deleteUser(users.body.usuarios[0]._id).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  })

  it('Attempting to delete not found user', () => {
    cy.deleteUser('0000').then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Nenhum registro excluído')
    })
  })

  it('Attempt to delete an user with shopping cart [TO-DO]', () => {
    // TODO - Implementar teste
  })
})

context('Editing an user', () => {
  const editedUser = {
    nome: 'FulanoEditado da Silva 55',
    email: 'beltranoTestador@qa.com.br',
    password: 'testeDiferente',
    administrador: 'true',
  }

  it('Edit a valid user', () => {
    cy.getUsersList().then((users) => {
      expect(users.status).to.equal(200)
      expect(users.body).be.not.empty

      cy.editUser(users.body.usuarios[0]._id, editedUser).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })

      cy.searchUser(users.body.usuarios[0]._id).then(({ body }) => {
        expect(body.nome).to.equal(editedUser.nome)
        expect(body.email).to.equal(editedUser.email)
        expect(body.password).to.equal(editedUser.password)
        expect(body.administrador).to.equal(editedUser.administrador)
      })
    })
  })

  /* NOTE - According to app's rules, when tries to edit
   *        an user with unknown ID, it should be created
   *        except if email already exists.
   */
  it('Edit with an unknown ID but same data (should fail)', () => {
    cy.editUser('0000', editedUser).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    })
  })
  it('Edit with an unknown ID and different data (should create a new user)', () => {
    const newUser = {
      nome: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: 'true',
    }
    cy.editUser('0000', newUser).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')

      cy.searchUser(response.body._id).then(({ body }) => {
        expect(body.nome).to.equal(newUser.nome)
        expect(body.email).to.equal(newUser.email)
        expect(body.password).to.equal(newUser.password)
        expect(body.administrador).to.equal(newUser.administrador)
      })
    })
  })
})
