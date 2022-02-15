

export class baseUtil {

    static getUsernameInput() {
        return cy.get("input[id*='LoginAreaFormPlaceHolder_txtUserName']")
    }

    static getNextButton() {
        return cy.get("a[id*='_btnNext']")
    }

    static getUsernameInputField() {
        return cy.get("input[id='login-email']")
    }

    static getPasswordInput() {
        return cy.get("input[id*='login-password']")
    }

    static getPasswordInputString() {
        return "input[id*='login-password']"
    }

    static getLogInButton() {
        return cy.get("button[id*='btn-login']")
    }
}