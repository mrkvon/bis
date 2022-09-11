describe 'Simple tests', ->
  beforeEach ->
    cy.clearLocalStorage()
#    cy.request('api/v1/contrib/command/flush_db/')
#    cy.request('api/v1/contrib/command/create_test_data/')


  it 'Should pass', ->
    expect(true).to.equal(true)

  it 'Should load page', ->
    cy.visit('/')

