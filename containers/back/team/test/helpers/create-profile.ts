import { Profile } from '../../src/team/schemas/profile.schema';
import { User } from '../../src/team/schemas/user.schema';
import * as mongoose from 'mongoose';

export const createProfile = async (
  id: number,
  userName: string,
  profileHandle: string,
) => {
  const user = User.build({
    id: id,
    name: userName,
    version: 0,
  });
  await user.save();

  const profile = Profile.build({
    handle: profileHandle,
    user_id: user.id,
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await profile.save();

  await sleep(1000);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
