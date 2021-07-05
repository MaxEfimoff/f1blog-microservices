import { Profile } from "../../../db/models/Profile";
import { User } from "../../../db/models/User";
import { generatedId } from "./generate-id";

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
    user_id: user.id,
    id: generatedId,
    version: 0,
  });
  await profile.save();

  await sleep(3000);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
