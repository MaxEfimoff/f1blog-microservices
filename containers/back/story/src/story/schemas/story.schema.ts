import * as mongoose from 'mongoose';
import { ProfileDoc } from './profile.schema';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TeamDoc } from './team.schema';

export interface CommentAttrs {
  profile: ProfileDoc;
  text: string;
  _id?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  rating?: number;
}

export interface ThreadAttrs {
  profile: ProfileDoc;
  text: string;
  _id?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  rating?: number;
  comments?: CommentAttrs[];
}

// An interface that describes the properties
// that are required to create a new Story
interface StoryAttrs {
  profile: ProfileDoc;
  title: string;
  text: string;
  image?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: ThreadAttrs[];
  tags?: ProfileDoc[];
  createdAt?: number;
  updatedAt?: number;
}

// An interface that describes the properties
// that a Story Model has
interface StoryModel extends mongoose.Model<StoryDoc> {
  build(attrs: StoryAttrs): StoryDoc;
}

// An interface that describes the properties
// that a single Story Document has
export interface StoryDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  text: string;
  image?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: ThreadAttrs[];
  team: TeamDoc;
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

export const StorySchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    title: {
      type: String,
      max: 200,
    },
    text: {
      type: String,
      max: 1200,
    },
    image: {
      type: String,
      max: 1000,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    threads: [
      {
        profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        text: {
          type: String,
          max: 1000,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
          },
        ],
        rating: {
          type: Number,
        },
        comments: [
          {
            profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
            text: {
              type: String,
              max: 1000,
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
              },
            ],
            dislikes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
              },
            ],
            rating: {
              type: Number,
            },
            createdAt: {
              immutable: true,
              type: Date,
              default: Date.now,
            },
            updatedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          immutable: true,
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    tags: [
      {
        type: String,
      },
    ],
    createdAt: {
      immutable: true,
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
        delete ret.__v;
      },
    },
  },
);

StorySchema.set('versionKey', 'version');
StorySchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a StorySchema
StorySchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Story.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a StorySchema
StorySchema.statics.build = (attrs: StoryAttrs) => {
  return new Story(attrs);
};

const Story = mongoose.model<StoryDoc, StoryModel>('Story', StorySchema);

export { Story };
