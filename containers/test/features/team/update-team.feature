Feature: Update team

  Scenario: Entering valid credentials and update new team
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    And I send valid payload to update created team
    Then Team is successfully updated

  Scenario: Entering invalid credentials and update new team
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    And I send invalid payload to update created team
    Then Get an error