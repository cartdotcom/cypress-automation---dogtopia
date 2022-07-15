export class order {

    static getOrdersTitle() {
        return cy.get("div[class='page-content-inner'] ol span")
    }

    static getEditOrderButtonByIndex(index) {
        return cy.get("table tbody tbody tr:nth-child(" + (index + 1) + ") td:nth-child(2) a[title='Edit Order']")
    }

    static getEditOrderButtonByOrderNum(orderNo) {
        return cy.get("table tbody tbody a[class='opt']").contains(orderNo).parent().parent().parent().find("a[title='Edit Order']")
    }

    static getOrderEditIframe() {
        return cy.get("iframe[src*='OrderEdit']")
            .its("0.contentDocument.body").should("not.be.empty")
            .then((body) => { cy.wrap(body) })
    }

    static getProductSearchIframe() {
        return cy.get("iframe[src*='QuickProductSearch']")
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
        cy.wait(10000)
        return this.getOrderEditIframe().find("div[class*='alert-success']")
    }

    static getOrderEditSuccessBannerCloseBtn() {
        return this.getOrderEditIframe().find("div[class*='alert-success'] div[class='alert-close']")
    }

    static getOrderSearchItem() {
        return this.getOrderEditIframe().find("input[id*='txtProductSearch']")
    }

    static getExistingOrderName() {
        return this.getOrderEditIframe().find("div[class*='order-edit-item-name'] a")
    }

    static getAddItemButton() {
        return this.getOrderEditIframe().find("input[class*='AddItemButton']")
    }

    static getAddButtonOnProductSearchIframe() {
        return this.getProductSearchIframe().find("div[id*='upProductResults'] div[class*='item-details']:nth-child(3) span input")
    }

    static getOrderQuanity() {
        return this.getOrderEditIframe().find("div[class*='OrderEditOverridePrice'] input[id*='Quantity']")
    }

    static getOrderOverridePrice() {
        return this.getOrderEditIframe().find("div[class*='OrderEditOverridePrice'] input[id*='txtPriceOverride']")
    }

    static getOrderRemove() {
        return this.getOrderEditIframe().find("td[class='ShoppingCart'] a[alternatetext='Remove from Cart']")
    }

    static getOrderRemoveBtnByName(name) {
        return this.getOrderEditIframe().find("div[class*='order-edit-item-name'] a").contains(name).parent().parent().parent().find("a[title='Remove from Order']")
    }

    static getOrderByName(name) {
        return this.getOrderEditIframe().find("div[class*='order-edit-item-name'] a").contains(name)
    }

    static getOrderTotal() {
        return this.getOrderEditIframe().find("div[id*='ctlOrderItemsEdit_trTotal'] span[id*='_ctlOrderItemsEdit_lblTotal']")
    }
}
