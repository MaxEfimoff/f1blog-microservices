import { Profile } from "../../../db/models/Profile";
import { User } from "../../../db/models/User";

export const createProfile = async (
  id: number = 1,
  name: string = "max3",
  handle: string = "sweet"
) => {
  const user = User.build({
    id: id,
    name: name,
    version: 0,
  });
  await user.save();

  const profile = Profile.build({
    handle: handle,
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
