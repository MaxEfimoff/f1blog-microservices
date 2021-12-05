Feature: Create new team

  Scenario: Entering valid credentials for new team
    Given  I have created profile for a user
    When  I send valid credentials for a new group
    Then  New group should be created

  Scenario: Entering invalid credentials for new team
    Given  I have created profile for a user
    When  I send invalid credentials for a new group
    Then  New group should not be created