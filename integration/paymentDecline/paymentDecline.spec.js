import { onlineStore } from "../../support/pageObject/onlineStore.admin.po";
import { orderData, orderSaveMsg, invalidCC, orderStatus } from "../../support/data/order.data";
import { order } from "../../support/pageObject/onlineStore.admin.order.po";
import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';
const faker = require('faker');

describe("Create a order with invalid credit card details and verify it in the fulfillment page", () => {

    let qty = 1;

    it("Verify creating a order from Store front with invalid credit card details", () => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.log("Add a item to the cart");
        cy.request({
            method: 'POST',
            url: Cypress.config("storeFrontUrl") + Cypress.config("productOne"),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: {
                _VS: 528,
                __VIEWSTATE: '',
                txtRedirectSearchBox: '',
                ddSearchBoxCategories: 0,
                txtRedirectSearchBox: '',
                ddSearchBoxCategories: 0,
                acctl446$txtEmailAddress: '',
                acctl446$txtPasswor: '',
                hfItemID: 36,
                hfQtyDiscountAcrossVariants: false,
                hfUseVariantInventory: false,
                txtQuantity: qty,
                btnAddToCart: 'Add to Cart',
                acctl167$txtEmailAddress: '',
                acIntegrityCheck: 'ac integrity check',
                __VIEWSTATEENCRYPTED: ''
            },
        }).then(({ }) => {
            cy.log("Visit the store front URL");
            cy.visit(Cypress.config("storeFrontUrl"));
            cy.log("Click on Cart Icon");
            storeFront.getCartIcon().should('exist').click({ force: true });
            cy.log("Click on Proceed to checkout button");
            storeFront.getProceedToCheckout().should('exist').click({ force: true });

            let billFName = faker.name.firstName();
            let billLName = faker.name.lastName();
            let billState = "Alaska"
            let billCity = "Juneau"
            let billZip = "99812";
            let billAddress = faker.address.streetAddress();
            let billPhone = faker.phone.phoneNumber('9#########');

            let email = faker.internet.email();
            let shipFName = faker.name.firstName();
            let shipLName = faker.name.lastName();
            let shipState = "Texas"
            let shipCity = "Houston";
            let shipZip = "77084";
            let shipAddress = faker.address.streetAddress();
            let shipPhone = faker.phone.phoneNumber('9#########');

            cy.log("Enter email address");
            storeFront.getCustomerEmail().should('exist').type(email, { force: true });
            storeFront.getContinueAsGuestBtn().click({ force: true });

            cy.log("Enter shipping address");
            storeFront.getShipFirstNameInput().should('exist').type(shipFName, { force: true });
            storeFront.getShipLastNameInput().should('exist').type(shipLName, { force: true });
            storeFront.getShipStateDropdown().should('exist').select(shipState)
            storeFront.getShipCityInput().should('exist').type(shipCity, { force: true });
            storeFront.getShipZipInput().should('exist').type(shipZip, { force: true });
            storeFront.getShipPhoneNoInput().scrollIntoView().click()
            cy.wait(5000);
            storeFront.getShipPhoneNoInput().click({ force: true }).clear().type(shipPhone, { delay: 200 }).then(() => {
                storeFront.getShipAddress1Input().should('exist').type(shipAddress, { force: true })
            })
            storeFront.getShipContinueBtn().click({ force: true });

            cy.log("Uncheck the same as billing address");
            cy.wait(2000)
            storeFront.getBillSameAsShipAdrCheckbox().should('exist').click({ force: true });

            cy.log("Enter billing address");
            storeFront.getBillFirstNameInput().should('exist').type(billFName, { force: true });
            storeFront.getBillLastNameInput().should('exist').type(billLName, { force: true });
            storeFront.getBillStateDropdown().select(billState);
            storeFront.getBillCityInput().should('exist').type(billCity, { force: true });
            storeFront.getBillZipInput().should('exist').type(billZip, { force: true });
            storeFront.getBillPhoneInput().scrollIntoView().click()
            cy.wait(5000);
            storeFront.getBillPhoneInput().click({ force: true }).clear().type(billPhone, { delay: 200 }).then(() => {
                storeFront.getBillAddressInput().should('exist').type(billAddress, { force: true })
            })
            storeFront.getBillContinueBtn().click({ force: true });

            cy.log("Enter payment details");
            cy.wait(2000)
            storeFront.getCardNumberInput().clear().type(invalidCC.ccNum);
            storeFront.getCardNameInput().clear().type(invalidCC.ccName);
            storeFront.getCardCvv().clear().type(invalidCC.ccCvv);
            storeFront.getCardExp().clear().type(invalidCC.ccExp);
            cy.wait(2000)
            cy.log("Click on Place order button");
            storeFront.getPlaceOrderBtn().should('exist').click({ force: true });
            cy.log("Verify the Status of the order is Credit Declined");
            storeFront.getOrderNoAfterPlacing().invoke('text').then((val) => {
                cy.writeFile("temp.json", {
                    orderNo: val
                })
            })
            storeFront.getOrderStausAfterPlacing().should('exist').invoke('text').should('eq', orderStatus.creditDeclined);
        })
    })

    it("Verify the order entry in Console - Fulfillment page when status of the order is Payment Declined", () => {
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

    it("Verify changing the status of the order to 'Awaiting Payment'", () => {
        cy.readFile("temp.json").then((expectedData) => {
            cy.log("Login to the portal")
            cy.visit(Cypress.config("storeAdminUrl"));
            cy.loginAdmin(Cypress.env("username"), Cypress.env("password"));
            cy.log("Click on the Orders option in the navigation menu");
            onlineStore.getOrderOption().click({ force: true });
            cy.log("Click on the Orders sub option");
            onlineStore.getOrderSubOption().click({ force: true });
            order.getOrdersTitle().should('exist').invoke('text').should('contain', orderData.orderTitle);

            cy.log("Click the edit order botton on first row of the table");
            order.getEditOrderButtonByOrderNum(expectedData.orderNo).click({ force: true });
            order.getEditOrderTitle().should('exist').invoke('text').should('contain', orderData.editOrderTitle);
            cy.log("Select the Order status as Cancel Order");
            order.getOrderStatusDropdown().select(orderStatus.approved);
            cy.log("Click the Save button");
            order.getOrderEditSaveButton().click({ force: true });
            cy.wait(7000);
            cy.log("Verify the Success message");
            order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
        })
    })

    it("Verify the order entry in Console - Fulfillment page when status of the order is Awaiting Payment", () => {
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
            cy.log("Verify the records with order number entered should be displayed on the search results on the page");
            fulfillment.getOrderNumberOnCard(0).should('exist');
        })
    })
})