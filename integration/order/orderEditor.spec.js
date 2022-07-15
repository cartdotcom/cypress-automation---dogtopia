import { onlineStore } from "../../support/pageObject/onlineStore.admin.po";
import { orderData, orderSaveMsg, orderStatus } from "../../support/data/order.data";
import { order } from "../../support/pageObject/onlineStore.admin.order.po";

describe("Verify order editor", () => {

    const shouldBillAndShipAddressBeSame = false;
    const quantity = 1
    it("Verify creating a order from Store front", () => {
        cy.createOrder(shouldBillAndShipAddressBeSame, Cypress.config("productOne"), quantity)
    })

    it("Verify changing the status of the order to 'Awaiting Payment'", () => {
        cy.readFile("temp.json").then((expectedData) => {

            //change to awaiting payment
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
            cy.wait(2000)
            cy.log("Select the Order status as Cancel Order");
            order.getOrderStatusDropdown().select(orderStatus.awaitingPayment);
            cy.log("Click the Save button");
            order.getOrderEditSaveButton().click({ force: true });
            cy.log("Verify the Success message");
            order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
            order.getOrderTotal().invoke('text').should('eq', expectedData.totalWithTax);
            order.getOrderEditSuccessBannerCloseBtn().click();

            //add a new item

            let exisitngProduct;

            order.getExistingOrderName().invoke('text').then((val) => {
                if (val.toString().includes(Cypress.config("productOneName"))) {
                    cy.wait(1000)
                    exisitngProduct = Cypress.config("productOneName")
                    order.getOrderSearchItem().clear({ force: true }).type(Cypress.config("productTwo"))
                } else {
                    cy.wait(1000)
                    exisitngProduct = Cypress.config("productTwoName")
                    order.getOrderSearchItem().clear({ force: true }).type(Cypress.config("productOne"))
                }
                order.getAddItemButton().click()
            })
            order.getAddButtonOnProductSearchIframe().click()
            order.getOrderEditSaveButton().click()
            cy.log("Verify the Success message");
            order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
            order.getOrderEditSuccessBannerCloseBtn().click()
            order.getOrderTotal().invoke('text').should('not.eq', expectedData.totalWithTax);

            cy.wait(100).then(() => {
                //delete existing product
                order.getOrderRemoveBtnByName(exisitngProduct).click()
                order.getOrderEditSaveButton().click()
                cy.log("Verify the Success message");
                order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
                order.getOrderEditSuccessBannerCloseBtn().click();
                order.getOrderByName(exisitngProduct).should('not.exist');
                order.getOrderTotal().invoke('text').should('not.eq', expectedData.totalWithTax);
            })

            //update qty
            let initialQty
            order.getEditOrderNumber().invoke('attr', 'value').then((orderNo) => {
                order.getOrderQuanity().first().invoke('attr', 'value').then((val) => {
                    //  expOrderNo = orderNo;
                    initialQty = val;
                    console.log(val)
                    order.getOrderQuanity().first().clear().type(parseInt(val) + 1)
                })
            })
            order.getOrderEditSaveButton().click()
            cy.log("Verify the Success message");
            order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
            order.getOrderEditSuccessBannerCloseBtn().click()
            cy.wait(2000)

            //check editability of price
            order.getOrderOverridePrice().should('be.enabled').clear().type(1)
            order.getOrderEditSaveButton().click()
            cy.log("Verify the Success message");
            order.getOrderEditSuccessBanner().should('exist').invoke('text').should('eq', orderSaveMsg.sucMsg);
            order.getOrderEditSuccessBannerCloseBtn().click()
            cy.wait(2000)
        })
    })

})