import { Profile } from '../../../db/models/profile.schema';
import { User } from '../../../db/models/user.schema';

export const createProfile = async (
  id: number,
  userName: string = 'max3',
  profileHandle: string = 'sweet',
) => {
  const user = User.build({
    id: id,
    name: userName,
    version: 0,
  });
  await user.save();

  const profile = Profile.build({
    handle: profileHandle,
    user: user,
    date: Date.now(),
  });
  await profile.save();

  await sleep(3000);
  console.log('USER', user);
  console.log('profile', profile);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
