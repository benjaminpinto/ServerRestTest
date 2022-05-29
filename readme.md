# ServeRest API and E2E test suite

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/) ![Cypress Tests](https://github.com/benjaminpinto/ServerRestTest/actions/workflows/main.yml/badge.svg)

Sample project to show the use of Cypress to test ServeRest [API](https://serverest.dev/) and [Front End](https://front.serverest.dev/).

To get more details about booth, front and backend, visit ServeRest's [Github page](https://github.com/ServeRest).

## Pre-requirements

It is required to have Node.js and npm installed to run this project.

> I used versions `v16.15.0` and `8.5.5` of Node.js and npm, respectively. I recommend you to use the same or later versions.

## Installation

Run `npm install` (or `npm i` for the short version) to install the dev dependencies.

## Tests

Run `npm test` (or `npm t` for the short version) to run the test in headless mode.

Or, run `npm run cy:open` to open Cypress in interactive mode.

> **Note:** Before running the tests, make a copy of the [`cypress.env.example.json`](./cypress.env.example.json) file as `cypress.env.json`, and update variable's values. In this project, it's mandatory that exists a `cypress.env.json` file, so don't forget it.
>
> In order to simulate a real use case that use sensible data, `cypress.env.json` file is included on [`.gitignore`](./.gitignore) and it's safe that confidential info won't be versioned.

> **Important:** This project uses Github actions to CI. Considering that `cypress.env.json` isn't sent to repository for security reason, if you want it running at your own Github account (fork), you must add an secret entry at project's configuration page with the content of `cypress.env.json` file. [This post](https://glebbahmutov.com/blog/secrets-to-env/) shows how to do it.

## About the tests

The purpose of this project is to be an use case of how we can perform E2E and API tests upon a real application using Cypress.

### Finally, just some tips to understand the code

- We are using the online endpoint of ServeRest. According to it's [documentation page](https://github.com/ServeRest/ServeRest#online), all data stored are cleaned daily, at 3am.
- Due to make tests independent and fast, repeatable steps are made by using API calls, instead of repeatedly do it from GUI (ex: login);
- Spec files are organized in two main folders: [`api_tests`](cypress/integration/api_tests/) and [`gui_tests`](cypress/integration/gui_tests/).
- Custom commands are defined at [`api_commands`](cypress/support/api_commands.js) and [`gui_commands`](cypress/support/gui_commands.js)

---

This project was created by [Benjamin Pinto](https://www.linkedin.com/in/benjamin-pinto/).
