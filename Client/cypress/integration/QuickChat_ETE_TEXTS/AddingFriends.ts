describe("Testing adding and removing users from friends",()=>{
    it("Add type and delete user from friends",()=>{
        //Login
        cy.visit("/")
        cy.findByRole('link', {  name: /login/i}).click()
        cy.findByPlaceholderText(/e\-mail/i).type("test@gmail.com")
        cy.findByPlaceholderText(/password/i).type("test12345")
        cy.findByRole('button', {  name: /log in/i}).click()
        //Open friends/groups window
        cy.findByPlaceholderText(/add single\/group chat.../i).click()
    })
})