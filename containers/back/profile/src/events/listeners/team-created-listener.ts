import { Message } from 'node-nats-streaming';
import { Listener, TeamCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from '../queue-group-name';
import { Profile, ProfileDoc } from '../../db/models/profile.schema';
import { ProfileUpdatedPublisher } from '../publishers/profile-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class TeamCreatedListener extends Listener<TeamCreatedEvent> {
  subject: Subjects.TeamCreated = Subjects.TeamCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TeamCreatedEvent['data'], msg: Message) {
    console.log('PROFILE Team created event data!', data);

    const { version, profile_id, id } = data;

    const profile: ProfileDoc = await Profile.findById({ _id: profile_id });

    console.log(profile);

    profile.joinedTeams = [id, ...profile.joinedTeams];
    profile.myTeams = [id, ...profile.myTeams];

    await profile.save();
    console.log('updated profile', profile);

    // Publish a Profile Updated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profile.id,
      version: profile.version - 1,
      joinedTeams: profile.joinedTeams,
      myTeams: profile.myTeams,
      handle: profile.handle,
    });

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
