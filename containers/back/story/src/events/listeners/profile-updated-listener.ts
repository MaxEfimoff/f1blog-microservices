import { Message } from 'node-nats-streaming';
import { Listener, ProfileUpdatedEvent, Subjects } from '@f1blog/common';
import * as _ from 'lodash';
import { queueGroupName } from '../queue-group-name';
import { Profile } from '../../story/schemas/profile.schema';

export class ProfileUpdatedListener extends Listener<ProfileUpdatedEvent> {
  subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProfileUpdatedEvent['data'], msg: Message) {
    console.log('Story:Profile updated event data!', data);

    const { id, handle, version, joinedTeams, myTeams } = data;

    const profile = await Profile.findById({ _id: id });

    console.log('TEAM found profile', profile);

    profile.handle = handle;
    profile.version = version;
    profile.joinedTeams = joinedTeams;
    // profile.joinedTeams = _.cloneDeep(joinedTeams);
    profile.myTeams = myTeams;
    // profile.myTeams = _.cloneDeep(myTeams);
    // profile.avatar = avatar;
    // profile.background = background;

    console.log('PROFILE VERSION', profile.version);
    await profile.save();

    console.log(
      'TEAM saved profile after receiving ProfileUpdatedEvent',
      profile,
    );

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
