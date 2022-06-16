const faker = require('faker-br')
import { onUsersPage } from '../../support/pages/Users'

describe('Tests from users page', () => {
  beforeEach(() => {
    cy.guiAdminLogin(Cypress.env('admin'))
    cy.visit(Cypress.env('frontUrl') + '/admin/home')
  })

  context('Create user', () => {
    const nomeField = '[data-testid="nome"]'
    const emailField = '[data-testid="email"]'
    const passwordField = '[data-testid="password"]'
    const btnCadastrar = '[data-testid="cadastrarUsuario"]'
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    beforeEach(() => {
      cy.get('[data-testid="cadastrarUsuarios"]').click()
    })

    it('Check page elements', () => {
      cy.get(nomeField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite seu nome')
        .and('be.empty')
      cy.get(emailField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite seu email')
        .and('be.empty')
      cy.get(passwordField)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Digite sua senha')
        .and('be.empty')
      cy.get('.form-check')
        .should('be.visible')
        .children('[data-testid="checkbox"]')
        .should('not.be.checked')
      cy.get(btnCadastrar)
        .should('be.visible')
        .and('have.text', 'Cadastrar')
    })

    it('Tries to insert user with blank fields', () => {
      cy.get(btnCadastrar).click()
      cy.findByText(/Nome é obrigatório/i).should('be.visible')
      cy.findByText(/Email é obrigatório/i).should('be.visible')
      cy.findByText(/Password é obrigatório/i).should('be.visible')
    })

    it('Check email validation', () => {
      cy.get(emailField).type('any_invalid@email_com;')
      cy.get(btnCadastrar).click()
      cy.get(emailField)
        .invoke('prop', 'validity')
        .should('deep.include', {
          valid: false,
        })
    })

    it('Include a valid user', () => {
      cy.intercept('GET', '**/usuarios').as('getUsers')

      onUsersPage.fillForm(user)
      cy.get(btnCadastrar).click()
      cy.wait('@getUsers')
      cy.contains(user.name)
        .should('be.visible')
        .siblings(':nth-child(4)')
        .should('contain.text', 'false')
    })

    it('Include a valid admin', () => {
      const admin = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      cy.intercept('GET', '**/usuarios').as('getUsers')

      onUsersPage.fillForm(admin)
      cy.get('[data-testid="checkbox"]').check()
      cy.get(btnCadastrar).click()
      cy.wait('@getUsers')
      cy.findByText(admin.name)
        .should('be.visible')
        .siblings(':nth-child(4)')
        .should('have.text', 'true')
    })
  })

  context('List, edit and delete users', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('frontUrl') + '/admin/listarusuarios')
    })

    it('Check main elements at list page', () => {
      cy.findByText(/Lista dos usuários/i).should('be.visible')
      cy.findByRole('table').should('be.visible')
      cy.findByTestId('logout').should('be.visible')
    })

    it.skip('Edit user [Not implemented on frontend]', () => {
      cy.findAllByText(/Editar/i)
        .first()
        .click()
      cy.log("Edit functionality ins't implemented on frontend.")
    })

    it.only('Delete user', () => {
      cy.intercept('DELETE', '**/usuarios/*').as('deleteUser')
      let linesBeforeDel = 0

      cy.get('tbody')
        .children()
        .then((lines) => {
          linesBeforeDel = lines.length
          cy.wrap(lines[0])
            .find('.btn-danger')
            .click()
        })
      cy.wait('@deleteUser')
      cy.get('tbody')
        .children()
        .then((lines) => {
          expect(lines.length).to.be.equal(linesBeforeDel - 1)
        })
    })
  })
})
