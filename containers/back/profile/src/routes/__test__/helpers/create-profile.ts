import { Profile } from "../../../db/models/Profile";
import { User } from "../../../db/models/User";

export const createProfile = async (
  id: number,
  userName: string = "max3",
  profileHandle: string = "sweet"
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
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
