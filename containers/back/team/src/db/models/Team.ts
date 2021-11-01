import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ProfileDoc } from './Profile';
import { GroupDoc } from './Group';

// An interface that describes the properties
// that are required to create a new Team
interface TeamAttrs {
  profile: ProfileDoc;
  title: string;
  createdAt: number;
}

// An interface that describes the properties
// that a Team Model has
interface TeamModel extends mongoose.Model<TeamDoc> {
  build(attrs: TeamAttrs): TeamDoc;
  findByEvent(event: { id: string; version: number }): Promise<TeamDoc | null>;
}

// An interface that describes the properties
// that a single Team Document has
export interface TeamDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  description?: string;
  avatar?: string;
  members?: any[];
  groups?: GroupDoc[];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

const TeamSchema = new mongoose.Schema(
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
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
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
  },
);

TeamSchema.set('versionKey', 'version');
TeamSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a TeamSchema
TeamSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Team.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a TeamSchema
TeamSchema.statics.build = (attrs: TeamAttrs) => {
  return new Team(attrs);
};

const Team = mongoose.model<TeamDoc, TeamModel>('Team', TeamSchema);

export { Team };
