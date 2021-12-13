Feature: Fetch team by title

  Scenario: Successfully fetching existing team by title
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    Then  I successfully fetch created team by title

  Scenario: Unsuccessfully trying to fetch team by wrong title
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    And  I try to fetch created team by wrong title
    Then  I get an error message