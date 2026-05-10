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

  it('login and access boards page', () => {
    cy.intercept('POST', '**/board/list', {
      statusCode: 200,
      body: {
        success: true,
        boards: [
          {
            id: 1,
            content: 'First discussion',
            name: 'Test User',
            email: 'test@example.com',
            create_time: new Date().toISOString(),
            upvote_count: 5,
            downvote_count: 1,
            is_user_upvoted: false,
            is_user_downvoted: false
          }
        ]
      }
    }).as('fetchBoards')

    cy.intercept('POST', '**/user/verify', {
      statusCode: 200,
      body: { success: true }
    })

    cy.window().then(win => {
      win.localStorage.setItem('token', 'auth-token')
      win.localStorage.setItem('email', 'test@example.com')
      win.localStorage.setItem('name', 'Test User')
    })

    cy.visit('/boards')
    cy.wait('@fetchBoards')
    cy.get('textarea[placeholder="Enter text here"]').should('exist')
    cy.contains('First discussion').should('exist')
  })

  it('login and access profile page', () => {
    cy.intercept('POST', '**/user/profile/*', {
      statusCode: 200,
      body: {
        success: true,
        profile: {
          email: 'test@example.com',
          name: 'Test User',
          gender: 'male',
          birthdate: '1990-01-01',
          joined: '2025-01-01'
        }
      }
    }).as('fetchProfile')

    cy.intercept('POST', '**/user/verify', {
      statusCode: 200,
      body: { success: true }
    })

    cy.window().then(win => {
      win.localStorage.setItem('token', 'auth-token')
      win.localStorage.setItem('email', 'test@example.com')
      win.localStorage.setItem('name', 'Test User')
    })

    cy.visit('/profile')
    cy.wait('@fetchProfile')
    cy.contains('Test User').should('exist')
    cy.contains('test@example.com').should('exist')
  })
})
