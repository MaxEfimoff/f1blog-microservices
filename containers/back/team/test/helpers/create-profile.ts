import { Profile, ProfileDoc } from '../../src/team/schemas/profile.schema';
import { User } from '../../src/team/schemas/user.schema';
import * as mongoose from 'mongoose';
import { generatedId } from './generate-id';

export const createProfile = async (
  id: number,
  userName: string,
  profileHandle: string,
): Promise<ProfileDoc> => {
  const user = User.build({
    id: id,
    name: userName,
    version: 0,
  });
  console.log('USER', user);
  const res = await user.save();
  console.log('USER RES', res);

  const profile = Profile.build({
    handle: profileHandle,
    user_id: user.id,
    id: generatedId,
    version: 0,
  });
  await profile.save();

  return profile;
};
