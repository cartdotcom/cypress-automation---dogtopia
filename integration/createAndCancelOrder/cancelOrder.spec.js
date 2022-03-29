import { onlineStore } from "../../support/pageObject/onlineStore.admin.po";
import { orderData, orderStatus, orderSaveMsg } from "../../support/data/order.data";
import { order } from "../../support/pageObject/onlineStore.admin.order.po";
import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';

describe("Cancel a Order in the online store and Validate the entry in the console fulfilment", () => {

    it("Verify changing the status of the order to 'Cancel Order'", () => {
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
        cy.log("Select the Order status as Cancel Order");
        order.getOrderStatusDropdown().select(orderStatus.cancelOrder);
        cy.log("Click the Save button");
        order.getOrderEditSaveButton().click({ force: true });
        cy.wait(7000);
        cy.log("Verify the Success message");
        order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);

    })

    it("Verify the order entry in Console - Fulfillment page after cancelling", () => {
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
            fulfillment.getOrderNumberOnCard(0).should('not.exist');
        })
    })

})