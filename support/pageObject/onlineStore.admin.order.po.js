export class order {

    static getOrdersTitle() {
        return cy.get("div[class='page-content-inner'] ol span")
    }

    static getEditOrderButtonByIndex(index) {
        return cy.get("table tbody tbody tr:nth-child(" + (index + 1) + ") td:nth-child(2) a[title='Edit Order']")
    }

    static getOrderEditIframe() {
        return cy.get("iframe[src*='OrderEdit']")
            .its("0.contentDocument.body").should("not.be.empty")
            .then((body) => { cy.wrap(body) })
    }

    static getEditOrderTitle() {
        return this.getOrderEditIframe().find("div[class='pageTitle']")
    }

    static getEditOrderNumber() {
        return this.getOrderEditIframe().find("div[class='pageTitle'] input")
    }

    static getOrderStatusDropdown() {
        return this.getOrderEditIframe().find("select[id*='ctlOrderStatusDropDown']")
    }

    static getOrderEditSaveButton() {
        return this.getOrderEditIframe().find("button[id*='OverlayActions_btnPrimaryAction']")
    }

    static getOrderEditSuccessBanner() {
        return this.getOrderEditIframe().find("div[class*='alert-success']")
    }

}