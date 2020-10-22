import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  name: string;
  email: string;
  password: string;
  active?: boolean;
  role?: string;
  date?: Date;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a single User Document has
interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: string;
  date: Date;
  version: number;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 30,
    },
    active: {
      type: Boolean,
      default: false,
    },
    role: {
      enum: ['guest', 'moderator', 'admin'],
      type: String,
      required: true,
      default: 'guest',
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

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

// Add build method to a UserSchema
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
