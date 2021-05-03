import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ProfileDoc } from './Profile';
import { TeamDoc } from './Team';

// An interface that describes the properties
// that are required to create a new Group
interface GroupAttrs {
  profile: ProfileDoc;
  team: TeamDoc;
  title: string;
  createdAt: number;
}

// An interface that describes the properties
// that a Group Model has
interface GroupModel extends mongoose.Model<GroupDoc> {
  build(attrs: GroupAttrs): GroupDoc;
  findByEvent(event: { id: string; version: number }): Promise<GroupDoc | null>;
}

// An interface that describes the properties
// that a single Group Document has
export interface GroupDoc extends mongoose.Document {
  profile: ProfileDoc;
  team: TeamDoc;
  title: string;
  description?: string;
  avatar?: string;
  backgroundImage?: string;
  members?: ProfileDoc[];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

const GroupSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    title: {
      type: String,
      max: 200,
    },
    description: {
      type: String,
      max: 1200,
    },
    avatar: {
      type: String,
      max: 1200,
    },
    backgroundImage: {
      type: String,
      max: 1200,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
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

GroupSchema.set('versionKey', 'version');
GroupSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a GroupSchema
GroupSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Group.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a GroupSchema
GroupSchema.statics.build = (attrs: GroupAttrs) => {
  return new Group(attrs);
};

const Group = mongoose.model<GroupDoc, GroupModel>('Group', GroupSchema);

export { Group };
