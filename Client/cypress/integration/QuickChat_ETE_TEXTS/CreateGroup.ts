describe("Create and delete group, type on chat",()=>{
    it("Creating,typing and deleting group",()=>{
        //Login
        cy.visit("/")
        cy.findByRole('link', {  name: /login/i}).click()
        cy.findByPlaceholderText(/e\-mail/i).type("test@gmail.com")
        cy.findByPlaceholderText(/password/i).type("test12345")
        cy.findByRole('button', {  name: /log in/i}).click()
        //Open create group window
        cy.findByTestId("addGroupBtn").click()
        //Create new group
        cy.findByTestId("groupNameInput").type("Code masters")
        cy.findByRole('button', {  name: /create/i}).click()
        //Open group and send message
        cy.findByRole('button', {  name: /code masters/i}).click()
        cy.findByPlaceholderText(/send a message.../i).type("Hello World!")
        cy.findByTestId("sendBtn").click()
        //Delete group
        cy.findByTestId("converastionSettingsButton").click()
        cy.findByRole('button', {  name: /leave conversation/i}).click()
        cy.reload()
    })
})