Feature: Delete new team

  Scenario: Successfully create and delete new team
    Given  I have created profile for a user
    When  I send valid credentials for a new team
    And I deleted created team
    And I fetch list of all teams
    Then I validate that new team was deleted and is not present

  Scenario: Entering invalid credentials for deleting team
    Given  I have created profile for a user
    When  I send invalid credentials for team deleting
    Then  I get an error

  Scenario: Entering non existing credentials for deleting team
    Given  I have created profile for a user
    When  I send non existing credentials for team deleting
    Then  I get an error