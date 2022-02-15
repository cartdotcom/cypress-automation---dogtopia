# cypress-automation---dogtopia
Cypress test scripts for Dogtopia

# Steps to Install
    - Ensure Node and NPM are installed in the system
    - Run the command "npm install" on the terminal at root level to get the project dependency

# Steps to execute scripts on the test runner [GUI mode]
    - Run the command "npx cypress open"

# Steps to execute scripts on the cli [Non GUI mode]
    - Run the command "npx cypress run" with following arguments
        i. --spec path/to/the/specfile
        ii. --browser chrome/edge/electron [default = electron]
        iii. --headless [Non Gui mode] / --headed [Throuogh CLI but GUI mode]
    - Example: npx cypress run --spec integration/storeFront/storeFront.spec.js --browser chrome --headless
    - The above command will executes the scripts on chrome browser in a headless mode.