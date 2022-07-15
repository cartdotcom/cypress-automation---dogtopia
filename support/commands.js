
import { baseUtil } from "../support/pageObject/baseUtil.po";
import { decode } from 'jsonwebtoken'
import { storeFront } from '../support/pageObject/storeFront.po';
const faker = require('faker');


Cypress.Commands.add('loginAdmin', (username, password) => {
  baseUtil.getUsernameInput().should("exist").clear({ force: true }).type(username, { force: true });
  baseUtil.getNextButton().click({ force: true });
  cy.wait(2000);
  cy.window().then((win) => {
    if (win.document.querySelector(baseUtil.getPasswordInputStringConsole()) != null) {
      baseUtil.getPasswordInputConsole().should("exist").clear({ force: true }).type(password, { force: true });
      baseUtil.getLogInButtonConsole().click({ force: true });
    }
  })
})

Cypress.Commands.add('login', (username, password) => {
  const client_id = Cypress.env('auth0_client_id')
  const scope = 'openid profile email'
  const audience = 'api.local'

  cy.request({
    method: 'POST',
    url: Cypress.env('auth0_domain'),
    body: {
      grant_type: 'password',
      scope,
      audience,
      client_id,
      username,
      password,
    },
  }).then(({ body }) => {
    const { access_token, expires_in, id_token } = body
    const [header, payload, signature] = id_token.split('.')
    const tokenData = decode(id_token)

    window.localStorage.setItem(
      `@@auth0spajs@@::${client_id}::${audience}::${scope}`,
      JSON.stringify({
        body: {
          access_token,
          id_token,
          scope,
          expires_in,
          token_type: 'Bearer',
          decodedToken: {
            encoded: { header, payload, signature },
            header: {
              alg: 'RS256',
              typ: 'JWT',
            },
            claims: {
              __raw: id_token,
              ...tokenData,
            },
            user: tokenData,
          },
          audience,
          client_id,
        },
        expiresAt: Math.floor(Date.now() / 1000) + expires_in,
      }),
    )
  })
})

Cypress.Commands.add('createOrder', (sameBillAndShipFlag, prodName, quantity) => {
  const qty = quantity
  let sku;
  let orderNo;
  let totalWithoutTax;
  let totalWithTax;
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  cy.log("Add a item to the cart");
  cy.placeOrder(prodName, quantity).then(() => {
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
    storeFront.getCustomerEmail().should('exist').clear().type(email, { force: true });
    storeFront.getContinueAsGuestBtn().click({ force: true });

    cy.log("Enter shipping address");
    cy.wait(1000)
    storeFront.getShipFirstNameInput().should('exist').clear().type(shipFName, { delay: 200 }, { force: true });
    storeFront.getShipLastNameInput().should('exist').clear().type(shipLName, { delay: 200 }, { force: true });
    storeFront.getShipStateDropdown().should('exist').select(shipState)
    storeFront.getShipCityInput().should('exist').clear().type(shipCity, { force: true });
    storeFront.getShipZipInput().should('exist').clear().type(shipZip, { force: true });
    storeFront.getShipPhoneNoInput().scrollIntoView().click()
    cy.wait(5000);
    storeFront.getShipPhoneNoInput().click({ force: true }).clear().type(shipPhone, { delay: 200 }).then(() => {
      storeFront.getShipAddress1Input().should('exist').type(shipAddress, { force: true })
    })
    storeFront.getShipContinueBtn().click({ force: true });

    if (sameBillAndShipFlag) {
      cy.log("Check the same as billing address");
      cy.wait(2000)
      storeFront.getBillSameAsShipAdrCheckbox().should('exist').check({ force: true });
    } else {
      cy.log("Uncheck the same as billing address");
      cy.wait(2000)
      storeFront.getBillSameAsShipAdrCheckbox().should('exist').click({ force: true });
      cy.log("Enter billing address");
      cy.wait(1000)
      storeFront.getBillFirstNameInput().should('exist').clear().type(billFName, { delay: 200 }, { force: true });
      storeFront.getBillLastNameInput().should('exist').clear().type(billLName, { delay: 200 }, { force: true });
      storeFront.getBillStateDropdown().select(billState);
      storeFront.getBillCityInput().should('exist').clear().type(billCity, { force: true });
      storeFront.getBillZipInput().should('exist').clear().type(billZip, { force: true });
      storeFront.getBillPhoneInput().scrollIntoView().click()
      cy.wait(5000);
      storeFront.getBillPhoneInput().click({ force: true }).clear().type(billPhone, { delay: 200 }).then(() => {
        storeFront.getBillAddressInput().should('exist').type(billAddress, { force: true })
      })
    }
    storeFront.getBillContinueBtn().click({ force: true });
    cy.log("Enter payment details");
    cy.wait(3000)
    cy.window().then((win) => {
      win.document.querySelector(storeFront.getPurchaseOrder()).click()
      storeFront.getPurchaseOrderInput().clear().type("test123")
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
    if (sameBillAndShipFlag) {
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
          billFName: shipFName,
          billLName: shipLName,
          billState: shipState,
          billCity: shipCity,
          billZip: shipZip,
          billAddress: shipAddress,
          billPhone: shipPhone,
          qty: qty,
          sku: sku,
          orderNo: orderNo,
          totalWithoutTax: totalWithoutTax,
          totalWithTax: totalWithTax
        })
      })
    } else {
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
    }

    cy.wait(2000)
  })
})

Cypress.Commands.add('placeOrder', (prodName, qty) => {
  cy.request({
    method: 'POST',
    url: Cypress.config("storeFrontUrl") + prodName,
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
  })
})