import {faker} from "@faker-js/faker"

describe("Testing user interactions with user settings",()=>{
    const newEmail = faker.internet.email()
    console.log(newEmail)
    it("Change username,photo,email,password",()=>{
        //Login
        cy.visit("/")
        cy.findByRole('link', {  name: /login/i}).click()
        cy.findByPlaceholderText(/e\-mail/i).type("test@gmail.com")
        cy.findByPlaceholderText(/password/i).type("test12345")
        cy.findByRole('button', {  name: /log in/i}).click()
        //Open profile settings
        cy.findByTestId('settingsWindow').click()
        cy.findByRole('button', {  name: /account settings/i}).click()
        //Change photo
        cy.findByTestId("userImage").click().selectFile("./cypress/images/triangle.jpg")
        //Change name
        cy.findByTestId("inputName").clear().type(faker.fake('{{name.firstName}}'))
        cy.findByRole('button', {  name: /save/i}).click()
        //Change e-mail
        cy.findByTestId("inputEmail").clear().type(newEmail)
        cy.findByPlaceholderText("Password").type("test12345")
        cy.findByRole('button', {  name: /change email/i}).click()
        //Close accout settings & Log out
        cy.findByTestId("closeWindow").click()
        cy.findByTestId('settingsWindow').click()
        cy.findByRole('button', {  name: /log out/i}).click()
    })
    it("Login in with the new email and change to old image, old email",()=>{
        //Login with new email
        cy.visit("/")
        cy.findByRole('link', {  name: /login/i}).click()
        cy.findByPlaceholderText(/e\-mail/i).type(newEmail)
        cy.findByPlaceholderText(/password/i).type("test12345")
        cy.findByRole('button', {  name: /log in/i}).click()
        //Open profile settings
        cy.findByTestId('settingsWindow').click()
        cy.findByRole('button', {  name: /account settings/i}).click()
        //Change to old e-mail
        cy.findByTestId("inputEmail").clear().type("test@gmail.com")
        cy.findByPlaceholderText("Password").type("test12345")
        cy.findByRole('button', {  name: /change email/i}).click()
        //Change to old photo
        cy.findByTestId("userImage").click().selectFile("./cypress/images/square.jpg")
    })
})