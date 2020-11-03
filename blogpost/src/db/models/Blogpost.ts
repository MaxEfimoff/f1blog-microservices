import mongoose from 'mongoose';
import { ProfileDoc } from './Profile';
import { GroupDoc } from './Group';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new NewsItem
interface BlogPostAttrs {
  profile: ProfileDoc;
  title: string;
  text: string;
  image?: string;
  group?: GroupDoc;
  // likes?: ProfileDoc[];
  // dislikes?: ProfileDoc[];
  // threads?: [
  //   {
  //     profile: ProfileDoc;
  //     text: string;
  //     likes?: ProfileDoc[];
  //     dislikes?: ProfileDoc[];
  //     rating?: number;
  //     comments?: [
  //       {
  //         profile: ProfileDoc;
  //         text: string;
  //         likes?: ProfileDoc[];
  //         dislikes?: ProfileDoc[];
  //         rating?: number;
  //         createdAt: number;
  //         updatedAt?: number;
  //       }
  //     ];
  //   }
  // ];
  // tags?: ProfileDoc[];
  // updatedAt?: number;
  id?: string;
  version?: number;
  createdAt?: number;
}

// An interface that describes the properties
// that a BlogPost Model has
interface BlogPostModel extends mongoose.Model<BlogPostDoc> {
  build(attrs: BlogPostAttrs): BlogPostDoc;
}

// An interface that describes the properties
// that a single BlogPost Document has
export interface BlogPostDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  text: string;
  mainPost?: {
    type: boolean;
    default: false;
  };
  featuredPost?: {
    type: boolean;
    default: false;
  };
  group?: GroupDoc;
  image?: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: [
    {
      profile: ProfileDoc;
      _id?: string;
      text: string;
      likes?: ProfileDoc[];
      dislikes?: ProfileDoc[];
      rating?: number;
      comments?: [
        {
          profile: ProfileDoc;
          text: string;
          likes?: ProfileDoc[];
          dislikes?: ProfileDoc[];
          rating?: number;
          createdAt: number;
          updatedAt?: number;
        }
      ];
      createdAt: number;
      updatedAt?: number;
    }
  ];
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

const BlogPostSchema = new mongoose.Schema(
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
    mainPost: {
      type: Boolean,
      default: false,
    },
    featuredPost: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      max: 1000,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
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
        type: String,
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

BlogPostSchema.set('versionKey', 'version');
BlogPostSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a BlogPostSchema
BlogPostSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return BlogPost.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a BlogPostSchema
BlogPostSchema.statics.build = (attrs: BlogPostAttrs) => {
  return new BlogPost(attrs);
};

const BlogPost = mongoose.model<BlogPostDoc, BlogPostModel>(
  'BlogPost',
  BlogPostSchema
);

export { BlogPost };
