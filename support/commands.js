
import { baseUtil } from "../support/pageObject/baseUtil.po";
import { decode } from 'jsonwebtoken'

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
