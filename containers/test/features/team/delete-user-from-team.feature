Feature: Delete user from team

  Scenario: Successfully delete user from team
    Given  I have created 2 profiles for different users
    When  As a first user I have created new team
    And  As a second user I have joined created team
    And  I validated that second user's id exists in the list of joined users
    And  As a first user user I have deleted second user from the team
    Then  I validated that second user's id does not exist in the list of joined users

  Scenario: Try to delete user which is not member of a team from that team
    Given  I have created 2 profiles for different users
    When  As a first user I have created new team
    And  As a first user I try to delete second user from the team
    Then  As a first user I get an error