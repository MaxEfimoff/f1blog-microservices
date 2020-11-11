import mongoose from 'mongoose';
import { UserDoc } from './User';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new Profile
interface ProfileAttrs {
  user: UserDoc;
  subscribers?: [];
  subscribedProfiles?: [];
  subscribedBlogs?: [];
  joinedGroups?: [];
  handle: string;
  avatar?: string;
  background?: string;
  status?: string;
  karma?: number;
  date: number;
}

// An interface that describes the properties
// that a Profile Model has
interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc;
}

// An interface that describes the properties
// that a single Profile Document has
interface ProfileDoc extends mongoose.Document {
  user: UserDoc;
  subscribers?: ProfileDoc[];
  subscribedProfiles?: ProfileDoc[];
  subscribedBlogs?: [];
  joinedGroups?: [];
  handle: string;
  avatar?: string;
  background?: string;
  status?: string;
  karma?: number;
  date: number;
  version: number;
}

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // The ones who are subscribed for me
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    // The ones I am subscribed to
    subscribedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    // The ones I am subscribed to
    subscribedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    joinedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    handle: {
      type: String,
      required: true,
      min: 2,
      max: 40,
      unique: true,
    },
    avatar: {
      type: String,
      max: 200,
    },
    background: {
      type: String,
      max: 200,
    },
    status: {
      type: String,
      min: 2,
      max: 50,
    },
    karma: {
      type: Number,
      default: 1000,
    },
    date: {
      type: Date,
      default: Date.now,
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
  return new Profile(attrs);
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  ProfileSchema
);

export { Profile };
