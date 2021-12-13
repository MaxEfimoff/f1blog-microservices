Feature: Fetch all teams

  Scenario: Successfully fetching all teams
    Given  I have created profile for a user
    When  I have created 2 teams
    And  I fetch all teams
    Then  Both teams should be present