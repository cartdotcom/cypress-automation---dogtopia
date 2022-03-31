export class storeFront {

    static getHairStraightnerProd() {
        return cy.get("button[data-href*='hair-straightener-straightens']")
    }

    static getQuickViewIframe() {
        return cy.get("iframe[id*='quick-view-frame']")
            .its("0.contentDocument.body").should("not.be.empty")
            .then((body) => { cy.wrap(body) })

    }

    static pinHeader() {
        cy.get("div[class='Layout'] header[class='LayoutTop']").invoke("removeAttr", "style")
    }

    static getAddToCartButton() {
        return this.getQuickViewIframe().find("input[id='btnAddToCart']")
    }

    static getCartIcon() {
        return cy.get("a[class*='shoppingCart-icon']")
    }

    static getProceedToCheckout() {
        return cy.get("input[value*='Proceed to Checkout']")
    }

    static getCustomerEmail() {
        return cy.get("input[id*='txtCustomerEmail']")
    }

    static getContinueAsGuestBtn() {
        return cy.get("div[nextstep*='#shipping-container']")
    }

    static getShipFirstNameInput() {
        return cy.get("input[id*='addrShipping_txtFirstName']")
    }

    static getShipLastNameInput() {
        return cy.get("input[id*='addrShipping_txtLastName']")
    }

    static getShipStateDropdown() {
        return cy.get("select[id*='addrShipping_ddStateID']")
    }

    static getShipCityInput() {
        return cy.get("input[id*='addrShipping_txtCity']")
    }

    static getShipZipInput() {
        return cy.get("input[id*='addrShipping_txtZipCode']")
    }

    static getShipAddress1Input() {
        return cy.get("input[id*='addrShipping_txtAddress1']")
    }

    static getShipPhoneNoInput() {
        return cy.get("input[id*='addrShipping_txtPhoneNumber']")
    }

    static getShipContinueBtn() {
        return cy.get("div[nextstep*='#billing-container']")
    }

    static getBillSameAsShipAdrCheckbox() {
        return cy.get("span[id='liSameAsBilling'] input[id*='rblSameAsBillingAddress']")
    }

    static getBillSameAsShipAdrCheckboxString() {
        return "span[id='liSameAsBilling'] input[id*='rblSameAsBillingAddress']"
    }

    static getBillFirstNameInput() {
        return cy.get("input[id*='addrBilling_txtFirstName']")
    }

    static getBillLastNameInput() {
        return cy.get("input[id*='addrBilling_txtLastName']")
    }

    static getBillStateDropdown() {
        return cy.get("select[id*='addrBilling_ddStateID']")
    }

    static getBillCityInput() {
        return cy.get("input[id*='addrBilling_txtCity']")
    }

    static getBillZipInput() {
        return cy.get("input[id*='addrBilling_txtZipCode']")
    }

    static getBillAddressInput() {
        return cy.get("input[id*='addrBilling_txtAddress1']")
    }

    static getBillPhoneInput() {
        return cy.get("input[id*='addrBilling_txtPhoneNumber']")
    }

    static getBillContinueBtn() {
        return cy.get("div[nextstep*='#payment-container']")
    }

    static getIframeCCard() {
        return cy.get("iframe[id*='iframeCardNumber']")
            .its("0.contentDocument.body").should("not.be.empty")
            .then((body) => { cy.wrap(body) })
    }

    static getCardNumberInput() {
        return this.getIframeCCard().find("div[class*='CardNumberInput'] input[id*='txtCardNumber']")
    }

    static getCardNameInput() {
        return cy.get("div[class*='CreditCard-name'] input[id*='txtNameOnCard']")
    }

    static getCardExp() {
        return cy.get("div[class*='CreditCard-expiration'] input[id*='txtCCExpiration']")
    }

    static getCardCvv() {
        return cy.get("div[class*='CreditCard-cvv'] input[id*='txtCVV']")
    }

    static getPurchaseOrder() {
        return "div[class*='CustomPayments Custom'] div[data-payment-name='Purchase Order'] div div[data-payment-name='Purchase Order']"
    }

    static getPurchaseOrderInput() {
        return cy.get("input[id*='CustomPaymentMethods']")
    }

    static getPlaceOrderBtn() {
        return cy.get("div[class*='checkout-placeOrder'] input[id*='btnPlaceOrder']")
    }

    static getOrderNoAfterPlacing() {
        return cy.get("div[class*='CheckOutSubHeader'] span[id*='lblOrderID']")
    }

    static getSkuNoAfterPlacing() {
        return cy.get("div[class='OrderDetailsItemNr']")
    }

    static getOrderStausAfterPlacing() {
        return cy.get("span[id='lblOrderStatus']")
    }

    static getTotalWithoutTax() {
        return cy.get("td[class='ViewOrderHead-total']")
    }

    static getTotalWithTax() {
        return cy.get("span[id*='lblTotal']")
    }

    static getFulfilmentOption() {
        return cy.get("p+a[href='/order-fulfillment']").first()
    }

    static getProdAndServiceDropdown() {
        return cy.get("nav div:nth-child(3) button")
    }

    static getProductandService(prodAndService) {
        return cy.get("nav div:nth-child(3) div a[href='/" + prodAndService + "']")
    }
}