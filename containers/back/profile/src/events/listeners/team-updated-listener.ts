import { Message } from 'node-nats-streaming';
import { Listener, TeamUpdatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from '../queue-group-name';
import { Profile, ProfileDoc } from '../../db/models/profile.schema';
import { ProfileUpdatedPublisher } from '../publishers/profile-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class TeamUpdatedListener extends Listener<TeamUpdatedEvent> {
  subject: Subjects.TeamUpdated = Subjects.TeamUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TeamUpdatedEvent['data'], msg: Message) {
    console.log('PROFILLE service, Team updated event data!', data);

    if (data.members) {
      const { id, profile_id, members } = data;

      const profile: ProfileDoc = await Profile.findById({ _id: profile_id });

      let isProfileInTeamMembers: boolean;

      // Check if profile is in the members array
      if (members.length === 1 && members[0].id) {
        isProfileInTeamMembers =
          members.filter((member) => member.id.toString() === profile.id).length > 0;
      } else {
        isProfileInTeamMembers =
          members.filter((member) => member.toString() === profile.id).length > 0;
      }

      console.log('isProfileInTeamMembers', isProfileInTeamMembers);
      const isTeamInJoinedTeams =
        profile.joinedTeams.filter((team) => team.toString() === id).length > 0;
      console.log('isTeamInJoinedTeams', isTeamInJoinedTeams);
      if (isProfileInTeamMembers && isTeamInJoinedTeams) {
        msg.ack();
      } else if (isProfileInTeamMembers && !isTeamInJoinedTeams) {
        profile.joinedTeams.unshift(id);

        await profile.save();
        msg.ack();
      } else if (!isProfileInTeamMembers && isTeamInJoinedTeams) {
        // Get the remove index in Profile document
        const removeTeamIndex = profile.joinedTeams.map((item) => item._id.toString()).indexOf(id);

        // Splice out of Profile joinedTeams array
        profile.joinedTeams.splice(removeTeamIndex, 1);
        await profile.save();

        msg.ack();
      }

      console.log('PROFILE after leaving team', profile);

      // Publish a Profile Updated event
      // new ProfileUpdatedPublisher(natsWrapper.client).publish({
      //   id: profile.id,
      //   version: profile.version - 1,
      //   joinedTeams: profile.joinedTeams,
      //   myTeams: profile.myTeams,
      //   handle: profile.handle,
      // });
    }

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
