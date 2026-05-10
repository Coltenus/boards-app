describe('App E2E', () => {
  it('about page loads', () => {
    cy.visit('/about')
    cy.contains('Boards App')
    cy.get('img[alt="App Emblem"]').should('exist')
  })

  it('register form works', () => {
    cy.visit('/register')
    cy.get('input[placeholder="Name"]').type('John Doe')
    cy.get('input[placeholder="Email"]').type('john@example.com')
    cy.get('select').select('male')
    cy.get('input[type="date"]').type('1990-01-01')
    cy.get('input[placeholder="Password"]').type('password123')
    cy.get('input[placeholder="Name"]').should('have.value', 'John Doe')
  })

  it('login form works', () => {
    cy.visit('/login')
    cy.get('input[placeholder="Email"]').type('test@example.com')
    cy.get('input[placeholder="Password"]').type('password')
    cy.get('input[placeholder="Email"]').should('have.value', 'test@example.com')
  })

  it('navigation between pages works', () => {
    cy.visit('/register')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    cy.contains('Register').click()
    cy.url().should('include', '/register')
  })
})
