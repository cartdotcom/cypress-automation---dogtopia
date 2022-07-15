import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';
import {featuredSolutions} from '../../support/data/order.data';
const faker = require('faker');

describe("Create a order from store Front and Validate the entry in the console fulfilment", () => {

    const shouldBillAndShipAddressBeSame = false;
    const quantity = 1

    it("Verify creating a order from Store front", () => {
        cy.createOrder(shouldBillAndShipAddressBeSame, Cypress.config("productOne"), quantity)
    })

    it.skip("Verify the order entry in Console - Fulfillment page after creating", () => {
        cy.log("Read from temp.json file");
        cy.readFile("temp.json").then((expectedData) => {
            cy.log("Login to the portal");
            cy.login(Cypress.env('auth0_username'), Cypress.env('auth0_password'))
            cy.log("Visit the conosle URL");
            cy.visit(Cypress.config("fulfillmentUrl"))
            cy.log("Click on fulfillment option");
            storeFront.getProdAndServiceDropdown().click({ force: true });
            storeFront.getProductandService(featuredSolutions.FULFILLMENT).click({ force: true });
            cy.wait(2000)
            cy.log("Click on the search by filter");
            fulfillment.getSearchByFilter().should('exist').click({ force: true });
            cy.log("Select Order option");
            fulfillment.getSearchByOrderNoOption().click({ force: true });
            cy.log("Enter the order number in the search field");
            fulfillment.getSearchInputField().clear({ force: true }).type(expectedData.orderNo, { force: true });
            cy.log("Click on the search button");
            fulfillment.getSearchButton().should('be.enabled').click({ force: true });
            cy.log("Verify the records with order number entered should display on the search results on the page");
            fulfillment.getOrderNumberOnCard(0).should('exist');
            cy.wait(2000);
            fulfillment.getOrderNumberOnCard(0).click({ force: true }).invoke('text').should('eq', expectedData.orderNo);

            cy.log("Verify Email, SKU, Qty, Total Price with and without tax");
            fulfillment.getPendingDetEmail().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.email.toString().toLowerCase())
            });
            fulfillment.getPendingDetSku().invoke('text').should('eq', expectedData.sku);
            fulfillment.getPendingDetQty().invoke('text').should('eq', expectedData.qty.toString());
            //fulfillment.getPendingDetTotalWithoutTax().invoke('text').should('eq', expectedData.totalWithoutTax);
            // fulfillment.getPendingDetTotalWithTax().invoke('text').should('eq', expectedData.totalWithTax);

            cy.log("Verify Shipping address");
            fulfillment.getPDShipAddressFirstLastName().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.shipFName.toString().toLowerCase())
            });
            fulfillment.getPDShipAddressFirstLastName().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.shipLName.toString().toLowerCase())
            });
            fulfillment.getPDShippingAddressStreetAdd().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.shipAddress.toString().toLowerCase())
            });
            fulfillment.getPDShippingAddressCityState().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.shipCity.toString().toLowerCase())
            });
            fulfillment.getPDShippingAddressCityState().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(fulfillment.getStateCode(expectedData.shipState.toString().toLowerCase()))
            });
            // fulfillment.getPDShippingAddressZip().invoke('text').should('contain', expectedData.shipZip);
            //  fulfillment.getPDShippingAddressPhone().invoke('text').should('contain', expectedData.shipPhone);

            cy.log("Verify billing address");
            fulfillment.getPDBillAddressFirstLastName().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.billFName.toString().toLowerCase())
            });
            fulfillment.getPDBillAddressFirstLastName().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.billLName.toString().toLowerCase())
            });
            fulfillment.getPDBillingAddressStreetAdd().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.billAddress.toString().toLowerCase())
            });
            fulfillment.getPDBillingAddressCityState().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(expectedData.billCity.toString().toLowerCase())
            });
            fulfillment.getPDBillingAddressCityState().invoke('text').should((val) => {
                expect(val.toString().toLowerCase()).to.contain(fulfillment.getStateCode(expectedData.billState.toString().toLowerCase()))
            });
            // fulfillment.getPDBillingAddressZip().invoke('text').should('contain', expectedData.billZip);
            //  fulfillment.getPDBillingAddressPhone().invoke('text').should('contain', expectedData.billPhone);

        })
    })
})