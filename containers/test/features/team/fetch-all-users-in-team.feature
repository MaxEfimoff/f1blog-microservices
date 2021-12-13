Feature: Fetch all users in team

  Scenario: Successfully fetch all users in team
    Given  I have created 3 profiles for different users
    When  As a first user I have created new team
    And  As a second user I have joined created team
    And  I fetched all users from the team and validate both users are there
    And  As a third user I have joined the team
    And  I fetched all users from the team and validate all three users are there
    And  As a second user I have left the team
    Then  I fetched all users from the team and validate both users are there