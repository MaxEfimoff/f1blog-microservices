Feature: Fetch my teams

  Scenario: Successfully fetch my teams
    Given  I have created profile
    When  I have fetched my teams and have validated that there are no teams created by me
    And  I have created new team
    And  I have fetched my teams and have validated that there is 1 team created by me
    And  I have created another team
    And  I have fetched my teams and have validated that there are 2 teams created by me
    And  I have deleted first team
    Then  I have fetched my teams and have validated that there is 2 teams left created by me