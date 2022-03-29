export class fulfillment {

    static getSearchByFilter() {
        return cy.get("button[bcf-cy-data='searchbarDropdownToggle']")
    }

    static getSearchByOrderNoOption() {
        return cy.get("a[bcf-cy-data='searchBarDropDownOptionorderNumber']")
    }

    static getSearchInputField() {
        return cy.get("input[bcf-cy-data='searchbarDropdownInputField']")
    }

    static getSearchButton() {
        return cy.get("button[bcf-cy-data='searchbarDropdownSearchButton']")
    }

    static getOrderNumberOnCard(index) {
        return cy.get("div[bcf-cy-data='ordersCard" + index + "'] div[class*='card-header'] div div div")
    }

    static getPendingDetSku() {
        return cy.get("a[bcf-cy-data='orderTable0'] div")
    }

    static getPendingDetQty() {
        return cy.get("table[class='table'] tr td:nth-child(3)").first()
    }

    static getPendingDetTotalWithoutTax() {
        return cy.get(".text-capitalize > :nth-child(1) > :nth-child(2)")
    }

    static getPendingDetTotalWithTax() {
        return cy.get(".text-capitalize > :nth-child(5) > :nth-child(2)")
    }

    static getPendingDetEmail() {
        return cy.get(".list-group > :nth-child(2) > :nth-child(2) > .text-primary")
    }

    static getPDShipAddressFirstLastName() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(3) div:nth-child(2)")
    }

    static getPDShippingAddressStreetAdd() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(3) div:nth-child(3)")
    }

    static getPDShippingAddressCityState() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(3) div:nth-child(5)")
    }

    static getPDShippingAddressZip() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(3) div:nth-child(6)")
    }

    static getPDShippingAddressPhone() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(3) div:nth-child(7)")
    }

    static getPDBillAddressFirstLastName() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(4) div:nth-child(2)")
    }

    static getPDBillingAddressStreetAdd() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(4) div:nth-child(3)")
    }

    static getPDBillingAddressCityState() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(4) div:nth-child(4)")
    }

    static getPDBillingAddressZip() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(4) div:nth-child(5)")
    }

    static getPDBillingAddressPhone() {
        return cy.get("div[class='list-group list-group-flush'] div[class*='text-capitalize list-group-item']:nth-child(4) div:nth-child(6)")
    }

    static getPDItemInTableByIndex(index) {
        return cy.get("table tr:nth-child(" + index + ") td:nth-child(2) div[class*='6px']")
    }

    static getPDItemQtyInTableByName(name) {
        return cy.get("table td:nth-child(2)").contains(name).parent().parent().find("td:nth-child(3)")
    }

    static getPDItemNameInTableByName(name) {
        return cy.get("table td:nth-child(2)").contains(name)
    }

    static getOrderTotalPrice() {
        return cy.get("div[class*='h3'] span:nth-child(2)")
    }
}