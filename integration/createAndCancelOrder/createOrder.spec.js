import { storeFront } from '../../support/pageObject/storeFront.po';
import { fulfillment } from '../../support/pageObject/fulfillment.po';
import {featuredSolutions} from '../../support/data/order.data';
const faker = require('faker');

describe("Create a order from store Front and Validate the entry in the console fulfilment", () => {

    let qty = 1;
    let sku;
    let orderNo;
    let totalWithoutTax;
    let totalWithTax;

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

            storeFront.getOrderNoAfterPlacing().invoke('text').should((val) => {
                orderNo = val;
            })
            storeFront.getSkuNoAfterPlacing().invoke('text').should((val) => {
                sku = val;
            })
            storeFront.getTotalWithoutTax().invoke('text').should((val) => {
                totalWithoutTax = val;
            })
            storeFront.getTotalWithTax().invoke('text').should((val) => {
                totalWithTax = val;
            })

            cy.log("Write into temp.json file");
            cy.wait(2000).then(() => {
                cy.writeFile("temp.json", {
                    email: email,
                    shipFName: shipFName,
                    shipLName: shipLName,
                    shipState: shipState,
                    shipCity: shipCity,
                    shipZip: shipZip,
                    shipAddress: shipAddress,
                    shipPhone: shipPhone,
                    billFName: billFName,
                    billLName: billLName,
                    billState: billState,
                    billCity: billCity,
                    billZip: billZip,
                    billAddress: billAddress,
                    billPhone: billPhone,
                    qty: qty,
                    sku: sku,
                    orderNo: orderNo,
                    totalWithoutTax: totalWithoutTax,
                    totalWithTax: totalWithTax
                })
            })
            cy.wait(2000)
        })

    })

    it("Verify the order entry in Console - Fulfillment page after creating", () => {
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