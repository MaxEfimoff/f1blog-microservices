import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new Profile
interface ProfileAttrs {
  user: {};
  // user: mongoose.Schema.Types.ObjectId;
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
  // user: mongoose.Schema.Types.ObjectId;
  user: {};
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

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      // type: mongoose.Schema.Types.ObjectId,
      type: {},
      ref: 'users',
    },
    // The ones who are subscribed for me
    subscibers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
      },
    ],
    // The ones I am subscribed to
    subscribedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
      },
    ],
    // The ones I am subscribed to
    subscribedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
      },
    ],
    joinedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
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

// Add build method to a ProfileSchema
ProfileSchema.statics.build = (attrs: ProfileAttrs) => {
  return new Profile(attrs);
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  ProfileSchema
);

export { Profile };
