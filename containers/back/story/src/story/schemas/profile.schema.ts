import * as mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TeamDoc } from './team.schema';
import { StoryDoc } from './story.schema';

// An interface that describes the properties
// that are required to create a new Profile
interface ProfileAttrs {
  user_id: string;
  handle: string;
  joinedTeams?: TeamDoc[];
  myTeams?: TeamDoc[];
  id: string;
  version: number;
}

// An interface that describes the properties
// that a Profile Model has
export interface ProfileModel extends mongoose.Model<ProfileDoc> {
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
  joinedTeams?: TeamDoc[];
  myTeams?: TeamDoc[];
  myStories?: StoryDoc[];
  version: number;
  _id?: string;
}

export const ProfileSchema = new mongoose.Schema(
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
    joinedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    myTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    myStories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
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
  },
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

export const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  ProfileSchema,
);
