import { Profile } from '../../../db/models/Profile';
import { User } from '../../../db/models/User';
import { Team } from '../../../db/models/Team';
import mongoose from 'mongoose';
import crypto from 'crypto';

export const createTeam = async (id: number, title: string) => {
  const user = User.build({
    id: id,
    name: crypto.randomBytes(5).toString('hex'),
    version: 0,
  });
  await user.save();

  const profile = Profile.build({
    handle: crypto.randomBytes(5).toString('hex'),
    user_id: user.id,
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await profile.save();

  const team = Team.build({
    profile_id: profile.id,
    title: title,
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await team.save();

  await sleep(1000);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
