Feature: Leave team

  Scenario: Successfully create, join and leave team
    Given  I have created 2 profiles for different users
    When  As a first user I have created new team
    And  As a second user I have joined created team
    And  I validated that second user's id exists in the list of joined users
    And  As a second user I have left the team
    Then  I validated that second user's id does not exist in the list of joined users

  Scenario: Try to leave team not being a member of it
    Given  I have created 2 profiles for different users
    When  As a first user I have created new team
    And  As a second user I try to leave the team not being a member of it
    Then  I get an error