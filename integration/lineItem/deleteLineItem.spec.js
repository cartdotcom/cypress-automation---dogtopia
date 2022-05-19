
import { onlineStore } from "../../support/pageObject/onlineStore.admin.po";
import { orderData, orderStatus, orderSaveMsg, featuredSolutions } from "../../support/data/order.data";
import { order } from "../../support/pageObject/onlineStore.admin.order.po";
import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';
import { expect } from "chai";
const faker = require('faker');

describe("Delete a line item in the online store and Validate the entry in the console fulfilment", () => {

    let qty = 1;

    it("Verify creating a order from Store front", () => {
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
            cy.window().then((win) => {
                win.document.querySelector(storeFront.getPurchaseOrder()).click()
                storeFront.getPurchaseOrderInput().type("test123")
                cy.wait(2000)
                cy.log("Click on Place order button");
                storeFront.getPlaceOrderBtn().should('exist').click({ force: true });
            })
        })
    })

    it("Verify deleting the line item from the order", () => {
        cy.log("Login to the portal")
        let expOrderNo;
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
            expOrderNo = orderNo;
        })
        order.getExistingOrderName().invoke('text').then((val) => {
            if (val.toString().includes(Cypress.config("productOneName"))) {
                cy.wait(1000)
                order.getOrderSearchItem().clear({ force: true }).type(Cypress.config("productTwo"))
            } else {
                cy.wait(1000)
                order.getOrderSearchItem().clear({ force: true }).type(Cypress.config("productOne"))
            }
            order.getAddItemButton().click()
        })
        order.getAddButtonOnProductSearchIframe().click()
        order.getOrderEditSaveButton().click()
        cy.wait(7000)
        cy.log("Verify the Success message");
        order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
        order.getOrderEditSuccessBannerCloseBtn().click()

        order.getOrderRemoveBtnByName(Cypress.config("productOneName")).click()
        order.getOrderEditSaveButton().click()
        cy.wait(5000)
        cy.log("Verify the Success message");
        order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
        order.getOrderEditSuccessBannerCloseBtn().click()
        cy.wait(2000)
        cy.log("Write the expected results in the temp file")
        order.getOrderTotal().invoke('text').then((total) => {
            cy.writeFile("temp.json", {
                orderNo: expOrderNo,
                expTotal: total
            })
        })

    })

    it("Verify the deleted order entry in Console - Fulfillment page after deleting a line item", () => {
        cy.wait(7000)
        cy.log("Read from temp.json file");
        cy.readFile("temp.json").then((expectedData) => {
            cy.log("Login to the portal");
            cy.login(Cypress.env('auth0_username'), Cypress.env('auth0_password'))
            cy.log("Visit the conosle URL");
            cy.visit(Cypress.config("fulfillmentUrl"))
            cy.log("Click on fulfillment option");
            storeFront.getProdAndServiceDropdown().click({ force: true });
            storeFront.getProductandService(featuredSolutions.FULFILLMENT).click({ force: true });
            cy.log("Click on the search by filter");
            fulfillment.getSearchByFilter().click({ force: true });
            cy.log("Select Order option");
            fulfillment.getSearchByOrderNoOption().click({ force: true });
            cy.log("Enter the order number in the search field");
            fulfillment.getSearchInputField().clear({ force: true }).type(expectedData.orderNo, { force: true });
            cy.log("Click on the search button");
            fulfillment.getSearchButton().should('be.enabled').click({ force: true });
            cy.log("Verify the records with order number entered should be displayed on the search results on the page");
            fulfillment.getOrderNumberOnCard(0).should('exist').click({ force: true });
            cy.wait(10000)
            cy.window().then((win) => {
                cy.log("Verify the absence of deleted line items")
                let result = []
                for (let index = 1; index < win.document.querySelectorAll("table tr").length; index++) {
                    fulfillment.getPDItemInTableByIndex(index).invoke('text').then((val) => {
                        result.push(val)
                    })
                }
                cy.wait(100).then(() => {
                    expect(result).to.not.have.lengthOf(0)
                    expect(result).to.not.include.members([Cypress.config("productOneName")])
                })
                cy.log("Verify the totalprice of the order")
                fulfillment.getOrderTotalPrice().invoke('text').should('eq', expectedData.expTotal);
            })
        })
    })

})