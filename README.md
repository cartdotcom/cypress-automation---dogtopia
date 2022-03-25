# cypress-automation---dogtopia
Cypress test scripts for Dogtopia

# Steps to Install
    - Ensure Node and NPM are installed in the system
    - Run the command "npm install" on the terminal at root level to get the project dependency

# Steps to execute scripts on the test runner [GUI mode]
    - Run the command "npx cypress open"
    - To launch the runner in specific environment like Dev, Stage or Prod
        run the command as mentioned in the package.json
        e.g. npm run e2e-test:dev / npm run e2e-test:stage

# Steps to execute scripts on the cli [Non GUI mode]
    - Run the command "npx cypress run" with following arguments
        i. --spec path/to/the/specfile
        ii. --browser chrome/edge/electron [default = electron]
        iii. --headless [Non Gui mode] / --headed [Throuogh CLI but GUI mode]
        iv. --env configFile= cypress.dev.json/cypress.stage.json/cypress.prod.json
    - Example: npx cypress run --spec integration/createAndCancelOrder/cancelOrder.spec.js --browser chrome --headless --env configFile= cypress.dev.json
    - The above command will executes the scripts on chrome browser in a headless mode against dev environment.