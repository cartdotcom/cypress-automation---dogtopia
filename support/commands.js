
import { baseUtil } from "../support/pageObject/baseUtil.po";

Cypress.Commands.add('login', (username, password) => {
    cy.url().should('contain', 'https://authenticate.cart.com/')
    cy.window().then((win) => {
        if (win.document.querySelector(baseUtil.getPasswordInputString()) != null) {
            baseUtil.getUsernameInputField().clear({ force: true }).type(username, { force: true });
            baseUtil.getPasswordInput().clear({ force: true }).type(password, { force: true });
            baseUtil.getLogInButton().click({ force: true });
        }
    })
})

Cypress.Commands.add('loginAdmin', (username, password) => {
    baseUtil.getUsernameInput().should("exist").clear({ force: true }).type(username, { force: true });
    baseUtil.getNextButton().click({ force: true });
    cy.wait(2000);
    cy.window().then((win) => {
        if (win.document.querySelector(baseUtil.getPasswordInputString()) != null) {
            baseUtil.getPasswordInput().should("exist").clear({ force: true }).type(password, { force: true });
            baseUtil.getLogInButton().click({ force: true });
        }
    })
})