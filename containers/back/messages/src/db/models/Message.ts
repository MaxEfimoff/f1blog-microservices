import mongoose from "mongoose";
import { ProfileDoc } from "./Profile";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a new Message
interface MessageAttrs {
  profile: ProfileDoc;
  text: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: [
    {
      profile: ProfileDoc;
      text: string;
      likes?: ProfileDoc[];
      dislikes?: ProfileDoc[];
      comments?: [
        {
          profile: ProfileDoc;
          text: string;
          likes?: ProfileDoc[];
          dislikes?: ProfileDoc[];
          createdAt: number;
          updatedAt?: number;
        }
      ];
    }
  ];
  createdAt: number;
  updatedAt?: number;
}

// An interface that describes the properties
// that a Message Model has
interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

// An interface that describes the properties
// that a single Message Document has
export interface MessageDoc extends mongoose.Document {
  profile: ProfileDoc;
  text: string;
  likes?: ProfileDoc[];
  dislikes?: ProfileDoc[];
  threads?: [
    {
      profile: ProfileDoc;
      _id?: string;
      text: string;
      likes?: ProfileDoc[];
      dislikes?: ProfileDoc[];
      comments?: [
        {
          _id?: string;
          profile: ProfileDoc;
          text: string;
          likes?: ProfileDoc[];
          dislikes?: ProfileDoc[];
          createdAt: number;
          updatedAt?: number;
        }
      ];
      createdAt: number;
      updatedAt?: number;
    }
  ];
  createdAt: number;
  updatedAt?: number;
  version: number;
}

const MessageSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    text: {
      type: String,
      max: 1200,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    threads: [
      {
        profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
        text: {
          type: String,
          max: 1000,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
          },
        ],
        comments: [
          {
            profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
            text: {
              type: String,
              max: 1000,
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
              },
            ],
            dislikes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
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

MessageSchema.set("versionKey", "version");
MessageSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a MessageSchema
MessageSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Message.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a MessageSchema
MessageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  MessageSchema
);

export { Message };
