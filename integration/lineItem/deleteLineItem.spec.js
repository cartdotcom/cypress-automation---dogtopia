
import { onlineStore } from "../../support/pageObject/onlineStore.admin.po";
import { orderData, orderStatus, orderSaveMsg } from "../../support/data/order.data";
import { order } from "../../support/pageObject/onlineStore.admin.order.po";
import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';
import { expect } from "chai";

describe("Delete a line item in the online store and Validate the entry in the console fulfilment", () => {

    it("Verify deleting the line item to the order", () => {
        cy.log("Login to the portal")
        cy.visit(Cypress.config("storeAdminUrl"));
        cy.loginAdmin(Cypress.env("username"), Cypress.env("password"));
        cy.log("Click on the Orders option in the navigation menu");
        onlineStore.getOrderOption().click({ force: true });
        cy.log("Click on the Orders sub option");
        onlineStore.getOrderSubOption().click({ force: true });
        order.getOrdersTitle().should('exist').invoke('text').should('contain', orderData.orderTitle);
        cy.log("Click the edit order botton on first row of the table");
        order.getEditOrderButtonByIndex(1).click({ force: true });
        order.getEditOrderTitle().should('exist').invoke('text').should('contain', orderData.editOrderTitle);
        order.getEditOrderNumber().invoke('attr', 'value').then((orderNo) => {
            cy.writeFile("temp.json", {
                orderNo: orderNo
            })
        })
        order.getOrderRemoveBtnByName(Cypress.config("productTwoName")).click()
        order.getOrderEditSaveButton().click()
        cy.wait(5000)
        cy.log("Verify the Success message");
        order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);

    })

    it("Verify the deleted order entry in Console - Fulfillment page after deleting a line item", () => {
        cy.log("Read from temp.json file");
        cy.readFile("temp.json").then((expectedData) => {
            cy.log("Login to the portal");
            cy.login(Cypress.env('auth0_username'), Cypress.env('auth0_password'))
            cy.log("Visit the conosle URL");
            cy.visit(Cypress.config("fulfillmentUrl"))
            cy.log("Click on fulfillment option");
            storeFront.getProdAndServiceDropdown().click({ force: true });
            storeFront.getProductandService('fulfillment').click({ force: true });
            cy.log("Click on the search by filter");
            fulfillment.getSearchByFilter().click({ force: true });
            cy.log("Select Order option");
            fulfillment.getSearchByOrderNoOption().click({ force: true });
            cy.log("Enter the order number in the search field");
            fulfillment.getSearchInputField().clear({ force: true }).type(expectedData.orderNo, { force: true });
            cy.log("Click on the search button");
            fulfillment.getSearchButton().should('be.enabled').click({ force: true });
            cy.log("Verify the records with order number entered should not be displayed on the search results on the page");
            fulfillment.getOrderNumberOnCard(0).should('exist').click({ force: true });
            cy.wait(10000)
            cy.window().then((win) => {
                let result = []
                for (let index = 1; index < win.document.querySelectorAll("table tr").length; index++) {
                    fulfillment.getPDItemInTableByIndex(index).invoke('text').then((val) => {
                        result.push(val)
                    })
                }
                cy.wait(100).then(() => {
                    expect(result).to.not.have.lengthOf(0)
                    expect(result).to.not.include.members([Cypress.config("productTwoName")])
                })
            })
        })
    })

})