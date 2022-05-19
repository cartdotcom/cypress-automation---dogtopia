

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

    static getPasswordInputConsole() {
        return cy.get("input[id*='login-password']")
    }

    static getPasswordInput() {
        return cy.get("input[id*='_txtPassword']")
    }

    static getPasswordInputStringConsole() {
        return "input[id*='login-password']"
    }

    static getPasswordInputString() {
        return "input[id*='_txtPassword']"
    }

    static getLogInButtonConsole() {
        return cy.get("button[id*='btn-login']")
    }

    static getLogInButton() {
        return cy.get("a[id*='btnLogin']")
    }
}