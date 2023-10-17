describe('Blog app', function() {
  beforeEach(function() {

    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    
    const user = {
      name: 'Dermot',
      username: 'dermot',
      password: 'fullstack'
    }
    
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('.username')
    cy.get('.password')
  })

  describe('Login',function() {
    
    it('succeeds with correct credentials', function() {
      cy.get('.username').type('dermot')
      cy.get('.password').type('fullstack')
      cy.get('#loginButton').click()

      cy.contains('Dermot logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('.username').type('dermot')
      cy.get('.password').type('Thispasswordiswrong')
      cy.get('#loginButton').click()

      cy.get('.message')
        .should('contain', 'Wrong Credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'dermot', password: 'fullstack' })
    })

    it('a blog can be created', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('a new blog created by cypress')
      cy.get('#author').type('johnny cypress')
      cy.get('#url').type('cypress.com/blogs/aregreat')
      cy.get('#submit').click()

      cy.get('.message')
        .should('contain', 'A New Blog: a new blog created by cypress by johnny cypress added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('.blogStyle')
        .should('contain', 'a new blog created by cypress by johnny cypress')
    })

    it('a blog can be liked', function() {
      cy.createBlog({ title: 'the second blog in cypress', author: 'Jim Cypressing', url: 'cypress.com/jjpress' })
      
      cy.contains('the second blog in cypress').parent()
      .contains('view').click()
      cy.contains('the second blog in cypress').parent()  
      .contains('like').click()
      
      cy.contains('the second blog in cypress').parent()
      .find('button').should('contain', 'unlike')
      cy.contains('the second blog in cypress').parent()
      .find('.likeContainer').should('contain', 'likes: 1')
    })

    it('a blog can be deleted by its user', function() {
      cy.createBlog({ title: 'the deleted blog in cypress', author: 'Jim Cypressing', url: 'cypress.com/jjpress' })

      cy.contains('the deleted blog in cypress').parent()
      .contains('view').click()
      cy.contains('the deleted blog in cypress').parent()
      .find('button').contains('delete').click()
      
      cy.contains('the deleted blog in cypress').should('not.exist')
    })

    it('a blog can only be deleted by its creator', function() {
      const user = {
        name: 'notDermot',
        username: 'notDermot',
        password: 'fullstack'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      cy.createBlog({ title: 'the undeletable blog in cypress', author: 'Jim Cypressing', url: 'cypress.com/jjpress' })

      cy.contains('logout').click()
      cy.login({ username: 'notDermot', password: 'fullstack' })

      cy.contains('the undeletable blog in cypress').parent()
      .contains('view').click()

      cy.contains('the undeletable blog in cypress').parent()
        .should('not.contain', 'delete')
      cy.contains('the undeletable blog in cypress').parent()
        .find('button').contains('delete').should('not.exist')
    })

    it('blogs are ordered by likes high->low', function() {
      cy.createBlog({ title: 'The lowest likes', author: 'Jim Cypressing', url: 'cypress.com/jjpress' })
      cy.createBlog({ title: 'The highest likes', author: 'Jim Cypressing', url: 'cypress.com/jjpress' })

      cy.get('.blogStyle').eq(0).should('contain', 'The lowest likes')
      cy.get('.blogStyle').eq(1).should('contain', 'The highest likes')

      cy.contains('The highest likes').parent()
      .find('button').contains('view').click()
      cy.contains('The highest likes').parent()
        .find('button').contains('like').click()

      cy.reload()
      
      cy.get('.blogStyle').eq(1).should('contain', 'The lowest likes')
      cy.get('.blogStyle').eq(0).should('contain', 'The highest likes')
    })
  })
})