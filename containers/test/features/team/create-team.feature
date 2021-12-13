Feature: Create new team

  Scenario: Entering valid credentials for new team
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    Then  New team should be created

  Scenario: Entering invalid credentials for new team
    Given  I have created profile for a user
    When  I send invalid credentials for a new team
    Then  New team should not be created

  Scenario: Entering empty credentials for new team
    Given  I have created profile for a user
    When  I send empty credentials for a new team
    Then  New team should not be created