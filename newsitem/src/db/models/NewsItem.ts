import mongoose from 'mongoose';
import { ProfileDoc } from './Profile';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new NewsItem
interface NewsItemAttrs {
  profile: ProfileDoc;
  title: string;
  text: string;
  image?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: [
    {
      profile: ProfileDoc;
      text: string;
      likes: ProfileDoc[];
      dislikes: ProfileDoc[];
      rating: number;
      comments?: [
        {
          profile: ProfileDoc;
          text: string;
          likes: ProfileDoc[];
          dislikes: ProfileDoc[];
          rating: number;
          createdAt: number;
          updatedAt: number;
        }
      ];
    }
  ];
  tags?: ProfileDoc[];
  createdAt: number;
  updatedAt?: number;
}

// An interface that describes the properties
// that a NewsItem Model has
interface NewsItemModel extends mongoose.Model<NewsItemDoc> {
  build(attrs: NewsItemAttrs): NewsItemDoc;
}

// An interface that describes the properties
// that a single NewsItem Document has
interface NewsItemDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  text: string;
  image?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: [
    {
      profile: ProfileDoc;
      text: string;
      likes: ProfileDoc[];
      dislikes: ProfileDoc[];
      rating: number;
      comments?: [
        {
          profile: ProfileDoc;
          text: string;
          likes: ProfileDoc[];
          dislikes: ProfileDoc[];
          rating: number;
          createdAt: number;
          updatedAt: number;
        }
      ];
      createdAt: number;
      updatedAt?: number;
    }
  ];
  tags?: ProfileDoc[];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

const NewsItemSchema = new mongoose.Schema(
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
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
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

NewsItemSchema.set('versionKey', 'version');
NewsItemSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a NewsItemSchema
NewsItemSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return NewsItem.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a NewsItemSchema
NewsItemSchema.statics.build = (attrs: NewsItemAttrs) => {
  return new NewsItem(attrs);
};

const NewsItem = mongoose.model<NewsItemDoc, NewsItemModel>(
  'NewsItem',
  NewsItemSchema
);

export { NewsItem };
