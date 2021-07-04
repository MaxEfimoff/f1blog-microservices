import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  name: string;
  id: number;
  version: number;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: number; version: number }): Promise<UserDoc | null>;
}

// An interface that describes the properties
// that a single User Document has
export interface UserDoc extends mongoose.Document {
  name: string;
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
    id: {
      type: Number,
      required: true
    }
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

// Add findByEvent method to a UserSchema
UserSchema.statics.findByEvent = (event: { id: number; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version,
  });
};

// Add build method to a UserSchema
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    id: attrs.id,
    name: attrs.name,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
