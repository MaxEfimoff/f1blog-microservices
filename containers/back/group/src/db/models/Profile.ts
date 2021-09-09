import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new Profile
interface ProfileAttrs {
  user_id: string;
  handle: string;
  id: string;
  version: number;
}

// An interface that describes the properties
// that a Profile Model has
interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProfileDoc | null>;
}

// An interface that describes the properties
// that a single Profile Document has
export interface ProfileDoc extends mongoose.Document {
  handle: string;
  user_id: string;
  version: number;
  joinedTeams: any[];
}

const ProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    handle: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

ProfileSchema.set('versionKey', 'version');
ProfileSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a ProfileSchema
ProfileSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Profile.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a ProfileSchema
ProfileSchema.statics.build = (attrs: ProfileAttrs) => {
  return new Profile({
    _id: attrs.id,
    handle: attrs.handle,
    user_id: attrs.user_id,
  });
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  ProfileSchema
);

export { Profile };
