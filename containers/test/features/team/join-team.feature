Feature: Join team

  Scenario: Successfully create and join new team
    Given  I have created 2 profiles for different users
    When  As a first user I create new team
    And  As a second user I join created team
    Then  I validate that 2nd user's id exists in the list of joined users

  Scenario: Try to join unexisting team
    Given  I have created profile for a user
    When  I try to join unexisting team
    Then  I get an error

  Scenario: Try to join a team twice
    Given  I have created 2 profiles for different users
    When  As a first user I create new team
    And  As a second user I join created team
    And  As a second user I try to join that team once more
    Then  I get an error