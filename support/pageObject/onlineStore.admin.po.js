
export class onlineStore {

    static getCustomerOption() {
        return cy.get("div[id='mainNav'] li[id='people'] a")
    }

    static getOrderOption() {
        return cy.get("li[id='orders'] div[id*='Nav_dvOrders']")
    }

    static getOrderSubOption() {
        return cy.get("li[id='orders'] div[id='ordersSubmenuContainer'] li:nth-child(1) a:nth-child(2)")
    }
}