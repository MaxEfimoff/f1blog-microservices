Feature: Fetch team by id

  Scenario: Successfully fetching existing team by id
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    Then  I successfully fetch created team by id

  Scenario: Unsuccessfully trying to fetch team by wrong id
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    And  I try to fetch created team by wrong id
    Then  I get an error message